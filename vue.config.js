const path = require('path'); // eslint-disable-line

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/_globalIncludes.scss";
        `,
        sassOptions: {
          includePaths: ['./node_modules'],
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@root': path.resolve(''),
        '@': path.resolve('src'),
      },
    },
  },
};
