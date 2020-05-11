/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const moment = require('moment');
const child_process = require('child_process');

const CODE_BRANCH = (child_process.execSync('git name-rev --name-only HEAD').toString() || '').replace(/('|\n)/gi, '');
const COMMER_USER = (child_process.execSync('git log --pretty=\'%an\' -1').toString() || '').replace(/('|\n)/gi, '');
const COMMER_MESSAGE = (child_process.execSync('git log --pretty=\'%s\' -1').toString() || '').replace(/('|\n)/gi, '');
const COMMER_TIME = (child_process.execSync('git log --pretty=\'%cd\' -1').toString() || '').replace(/('|\n)/gi, '');

const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const merge = require('lodash.merge');

const TARGET_NODE = process.env.WEBPACK_TARGET === 'node';
const target = TARGET_NODE ? 'server' : 'client';

module.exports = {
  outputDir: './dist',
  productionSourceMap: true,
  css: {
    extract: false, // 目前还没分离出css,正在努力尝试
  },
  publicPath:
    process.env.NODE_ENV !== 'production' ? 'http://localhost:8080' : '/',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    open: false,
    hot: true,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    proxy: {
      '/api': {
        target: 'http://localhost:7001', //  本地
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
  },
  configureWebpack: {
    entry: `./src/entry-${target}.ts`,
    devtool: 'source-map',
    target: TARGET_NODE ? 'node' : 'web',
    node: TARGET_NODE ? undefined : false,
    output: {
      libraryTarget: TARGET_NODE ? 'commonjs2' : undefined,
    },
    externals:
      // 可以分离大部分依赖，使打包出来的chunk体积变小
      process.env.NODE_ENV === 'production' && !TARGET_NODE
        ? {
          vue: 'Vue',
        }
        : undefined,
    plugins: [
      TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`, // 注意需要用双引号包住
        'process.env.CODE_VERSION': `"${moment(new Date()).format(
          'YYYY-MM-DD HH:mm:ss',
        )}"`,
        'process.env.CODE_BRANCH': `"${CODE_BRANCH}"`,
        'process.env.COMMER_USER': `"${COMMER_USER}"`,
        'process.env.COMMER_MESSAGE': `"${COMMER_MESSAGE}"`,
        'process.env.COMMER_TIME': `"${moment(new Date(COMMER_TIME)).format(
          'YYYY-MM-DD HH:mm:ss',
        )}"`,
      }),
    ],
  },
  chainWebpack: (config) => {
    if (TARGET_NODE) {
      config.plugins.delete('hmr'); // fix ssr hot update bug
      config.optimization.splitChunks(undefined);
    }
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        merge(options, {
          optimizeSSR: false,
        });
      });
  },
};
