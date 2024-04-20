module.exports = {
  input: [
    'apps/frontend-admin/src/**/*.{ts,tsx}',
    '!**/node_modules/**',
  ],
  output: './',
  options: {
    debug: true,
    func: {
      list: ['i18next.t', 'i18n.t', 't'],
      extensions: ['.ts', '.tsx'],
    },
    lngs: ['en', 'ru'],
    ns: ['translation'],
    defaultLng: 'en',
    defaultNs: 'translation',
    defaultValue: '__STRING_NOT_TRANSLATED__',
    resource: {
      loadPath: 'apps/frontend-admin/public/locales/{{lng}}/{{ns}}.json',
      savePath: 'apps/frontend-admin/public/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    nsSeparator: false,
    keySeparator: false,
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
    metadata: {},
    allowDynamicKeys: false,
  }
};
