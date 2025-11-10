const { getRequestConfig } = require('next-intl/server');

function unflattenMessages(flatMessages) {
  const result = {};
  for (const [key, value] of Object.entries(flatMessages)) {
    const segments = key.split('.');
    let node = result;
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (i === segments.length - 1) {
        node[segment] = value;
      } else {
        if (!node[segment]) node[segment] = {};
        node = node[segment];
      }
    }
  }
  return result;
}

module.exports = getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale ?? 'de';
  const flatMessages = require(`./src/app/messages/${resolvedLocale}.json`);
  return {
    locale: resolvedLocale,
    messages: unflattenMessages(flatMessages),
  };
});
