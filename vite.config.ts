import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const disableSecurity = env.DISABLE_SECURITY === 'true';

  return {
    plugins: [
      react(),
      ...(disableSecurity ? [] : [
        obfuscatorPlugin({
        // Aplica a ofuscação APENAS no momento da geração do pacote (npm run build)
        apply: 'build',
        exclude: [/node_modules/],
        options: {
          compact: true, // Remove quebras de linha (inline)
          controlFlowFlattening: true, // "Bagunça" o fluxo lógico para dificultar engenharia reversa
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: true, // Adiciona códigos lixo falsos para confundir o leitor
          deadCodeInjectionThreshold: 0.4,
          disableConsoleOutput: true, // Remove todos os console.log() do código
          identifierNamesGenerator: 'hexadecimal', // Troca variáveis por ex: _0x3a2b
          numbersToExpressions: true, // Converte números em contas (ex: 5 vira 2+3)
          selfDefending: true, // Quebra a execução se o inspetor tentar embelezar (formatar) o código
          simplify: true,
          splitStrings: true, // Corta strings (textos) em pedaços aleatórios
          stringArray: true, // Esconde as strings em um Array cifrado
          stringArrayEncoding: ['base64'], // Criptografa strings em Base64
          stringArrayThreshold: 0.75,
          unicodeEscapeSequence: false
        }
      })
      ])
    ],
    resolve: { alias: { '@': path.resolve(__dirname, 'src/react') } },
    server: {
      host: '127.0.0.1',
      proxy: {
        '/api': { target: env.FLUIG_URL || 'http://localhost:8080', changeOrigin: true, secure: false },
        '/style-guide': { target: env.FLUIG_URL || 'http://localhost:8080', changeOrigin: true, secure: false },
        '/portal/resources': { target: env.FLUIG_URL || 'http://localhost:8080', changeOrigin: true, secure: false }
      }
    },
    // Removido o 'esbuild: { minifyIdentifiers: false }' para habilitar a minificação brutal padrão do Vite
    build: {
      minify: disableSecurity ? false : 'esbuild',
      outDir: path.resolve(__dirname, 'target/classes/resources'),
      emptyOutDir: false,
      copyPublicDir: false,
      rollupOptions: {
        input: path.resolve(__dirname, 'src/react/main.tsx'),
        output: {
          format: 'iife',
          name: 'AppWidgetReact',
          entryFileNames: `js/${process.env.VITE_WIDGET_CODE || 'bundle'}.js`,
          chunkFileNames: 'js/[name].js',
          assetFileNames: (asset) => asset.name?.endsWith('.css') ? `css/${process.env.VITE_WIDGET_CODE || 'bundle'}.css` : 'assets/[name]-[hash][extname]',
        },
      },
    },
  };
});
