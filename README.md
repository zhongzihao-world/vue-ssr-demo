# 简介

## Vue SSR Demo

> 使用 Vue-cli4.0+Typescript+SSR 的小目 Demo
> 怎么说呢，从 vue3 开始，之前的 build 目录旧没有了，想要对 webpack 配置进行修改的话，只能在根目录下新建 **vue.config.js**文件，具体修改可参照[vue-cli 官网](https://cli.vuejs.org/)
> 之前用的是 vue-cli2.+,此次直接升级到 vue-cli4.+并且直接上了 TS，踩了不少坑，不过好在是熬过来了，分享一下我的项目 Demo

### 已实现

- 项目搭建
- 本地 ssr 开发环境搭建（koa）
- 使用 Vuex 实现数据预取(此 demo 已删掉，因为涉及到后端接口)
- 打包 chunk 分离优化
- Jenkins + Docker 持续集成、部署
- 集成到后端项目（egg.js）

---

## 主要命令

```bash
$ npm install   # 安装依赖
$ npm run dev   # 本地开发
 ├── 8080  本地非ssr环境
 └── 3000  本地ssr环境
$ npm run build   # window下打包命令
$ npm run build:linux   # linux下打包命令
```

---

## 项目目录

```bash
┌── .vscode IDE工作区配置
│   └── settings.json
├── dist # 静态资源（自动生成）
│   └── index.temp.html # ssr模板文件
├── public # 静态目录，打包的时候该目录会原封不动的复制到dist目录下
├── server # koa服务
│   ├── index.js # koa入口
│   └── server.js # 服务逻辑
├── src # 主要源码
│   ├── api # 请求管理
│   │   └── api.config.ts # 接口管理
│   │   └── axios.config.ts # 拦截器管理
│   ├── assets # 资源
│   │   └── ......
│   ├── plugins # 插件
│   │   └── ......
│   ├── utils # 全局方法等
│   │   └── ......
│   ├── views #  页面/视图
│   │   └── ......
│   ├── App.vue # 入口Vue
│   ├── entry-client.ts # 客户端入口
│   ├── entry-server.ts # 服务端入口
│   ├── main # 公共入口
│   ├── router.index.ts # 路由配置
│   ├── store.index.ts # Vuex配置
│   ├── vue-shim.d.ts # ts模块声明
└── .browserslistrc # 浏览器设置
└── .eslintrc.js # eslintrc设置
└── .gitignore # git忽略
└── babel.config.js # babel配置
└── Jenkinsfile # jenkins配置
└── package-lock.json # 版本锁定
└── package.json # 项目依赖
└── tsconfig.json # ts配置文件
└── vue.config.js # webpack配置文件
```

---

## webpack 配置文件 解析

1 关闭 css 分离

```bash
extract: false, // 目前还没分离出css,正在努力尝试
```

2 本地 ssr 搭建（）

```bash
本地搭建ssr环境，webpack-dev-server跑本地服务时，会打一次包并进行热更新，所以思路是再起一个node服务，读取监听打包的chunk文件进行ssr的操作，这里有两个点
- 设置 webpack-dev-serve 允许跨域
  headers: { 'Access-Control-Allow-Origin': '*' },
- 设置publicPath
// 加上端口前缀才能访问到静态资源，生产环境因为是集成到后端项目设置跟路径就OK了
  process.env.NODE_ENV !== 'production' ? 'http://localhost:8080' : '/',
```

3 分离 chunk 减少打包体积

```bash
// 可以分离大部分依赖，使打包出来的chunk体积变小
// 客户端生产环境  才分离
externals:
  // 可以分离大部分依赖，使打包出来的chunk体积变小
  process.env.NODE_ENV === 'production' && !TARGET_NODE
  ? {
      vue: 'Vue',
    }
  : undefined,
```

4 注入版本信息

```bash
new webpack.DefinePlugin({
  'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`, // 注意需要用双引号包住
}),
```

5 关闭 splitChunks

```bash
chainWebpack: (config) => {
  config.optimization.splitChunks(undefined);
},
```

---

## ssr 基本搭建

1 公共入口 main.ts

```bash
// 防止单例污染，需要导出一个工厂函数
export function createApp(): any {
  const router = createRouter();
  const store = createStore();
  const app = new Vue({
    router,
    store,
    render: (h) => h(App),
  });
  return { app, router, store };
}
```

2 客户端入口 entry-client.ts

```bash
// 挂载到app上
const { app, router } = createApp();
router.onReady(() => {
  app.$mount('#app');
});
```

3 服务端入口 entry-server.ts

```bash
// 匹配路由，需要返回一个promise，因为有可能是异步组件，若无匹配，则返回404
import { createApp } from './main';
export default (context: any) =>
  new Promise((resolve, reject) => {
    const { app, router } = createApp();
    router.push(context.url);
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      if (!matchedComponents.length) {
        return reject({
          code: 404,
        });
      }
      resolve(app);
    }, reject);
});
```

4 注意不要在组件的 mounted 钩子之前进行 dom 相关的操作，因为服务端会执行到这些钩子

5 实现本地 ssr

```bash
  - 读取web-dev-server打包出来的chunk并实时监听
  - 当chunk变化时，使用'vue-server-renderer'的renderToString，渲染成html字符串
```

6 本地 ssr 环境下，接口转发问题

```bash
  // 虽然可以配置 devServer proxy，但是ssr环境在另一个node端口下，需要对接口进行转发
  - 对接口进行规范，接口类的请求都加上'/api'前缀
  - koa server.js 下，对匹配的接口类请求，使用'http-proxy-middleware'和'koa2-connect'进行接口转发
```
