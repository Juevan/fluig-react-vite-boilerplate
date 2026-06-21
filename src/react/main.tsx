import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initTranslations } from './utils/i18n';
import './index.css';

declare const SuperWidget: any, WCMSpaceAPI: any, FLUIGC: any, $: any;
const win = window as any;

// 1. Mock Fluig APIs for Local Vite Dev
if (typeof SuperWidget === 'undefined') {
  win.SuperWidget = { extend: (obj: any) => ({ instance: (opts: any) => { const i = { ...obj, ...opts, DOM: { find: () => ({ each: () => {} }) } }; i.init?.(); return i; } }) };
  win.WCMSpaceAPI = { PageService: { UPDATEPREFERENCES: () => true } };
  win.FLUIGC = { toast: console.log };
}

// 2. Define Fluig Native Widget (Mode: Edit & View integration)
win.AppWidget = SuperWidget.extend({
  bindings: { local: { 'salvar-config': ['click_salvarConfig'] } },
  init(this: any) {
    if (this.mode === 'view') win.initAppWidget?.(this.instanceId);
  },
  salvarConfig(this: any) {
    const fields: any = {};
    this.DOM.find('input, select, textarea').each(function(this: any) { if (this.name) fields[this.name] = $(this).val(); });
    try {
      const res = WCMSpaceAPI.PageService.UPDATEPREFERENCES({ async: false }, this.instanceId, { widgetSettings: JSON.stringify(fields) });
      FLUIGC.toast({ title: res ? 'Sucesso:' : 'Erro:', message: res ? (this.successSaveMessage || 'Salvo!') : (this.errorSaveMessage || 'Erro!'), type: res ? 'success' : 'danger' });
    } catch (err: any) {
      FLUIGC.toast({ title: 'Erro:', message: err.message || err, type: 'danger' });
    }
  }
});

// 3. React Bootstrap
win.initAppWidget = (instanceId: string) => {
  const tryMount = (retries = 0) => {
    const rootEl = document.getElementById(`app-root-${instanceId}`);
    if (rootEl) {
      const parse = (attr: string) => { try { return JSON.parse(rootEl.getAttribute(attr) || '{}'); } catch { return {}; } };
      initTranslations(parse('data-translations'));
      ReactDOM.createRoot(rootEl).render(<React.StrictMode><App instanceId={instanceId} configs={parse('data-configs')} /></React.StrictMode>);
    } else if (retries < 10) setTimeout(() => tryMount(retries + 1), 50);
  };
  tryMount();
};

// 4. Local Vite Dev Setup
if (import.meta.env.DEV) {
  setTimeout(async () => {
    const rootEl = document.getElementById('app-root-local');
    if (!rootEl) return;

    if (import.meta.env.VITE_FLUIG_THEME === 'dark') {
      document.documentElement.style.cssText = '--themeResponsiveBgColor: #1e293b; --themeResponsiveTextColor: #f8fafc';
      Object.assign(document.body.style, { backgroundColor: '#1e293b', color: '#f8fafc' });
    }

    try {
      const res = await fetch(`/src/main/resources/widget_${import.meta.env.VITE_FLUIG_LANG || 'pt_BR'}.properties`);
      if (res.ok) {
        const tr = Object.fromEntries((await res.text()).split('\n').map(l => l.split('=')).filter(p => p[0]).map(([k, ...v]) => [k.trim(), v.join('=').trim()]));
        rootEl.setAttribute('data-translations', JSON.stringify(tr));
      }
    } catch {}

    win.AppWidget.instance({ mode: 'view', instanceId: 'local' });
  }, 0);
}
