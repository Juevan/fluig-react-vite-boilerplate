let activeTranslations: Record<string, string> = {};

/** Inicializa o dicionário ativo com as traduções */
export function initTranslations(translations: Record<string, string>): void {
  activeTranslations = translations || {};
}

/** Traduz uma chave usando o dicionário ativo */
export function translate(key: string, args?: (string | number)[]): string {
  let translation = activeTranslations[key] || key;

  // Substitui placeholders tipo {0}, {1} caso tenham sido passados argumentos
  if (args && args.length > 0) {
    args.forEach((arg, index) => {
      translation = translation.replace(`{${index}}`, String(arg));
    });
  }

  return translation;
}
