
const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  output: 'export',
  distDir: 'public', 
  trailingSlash: true,
  basePath: isProd ? '/base-path' : '',
  i18n: {
    locales: ['en', 'pl'], 
    defaultLocale: 'en',  
    localeDetection: false, 
  },
    
  };
  

