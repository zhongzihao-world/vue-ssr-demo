const fs = require('fs');
const Koa = require('koa');
const path = require('path');
const koaStatic = require('koa-static');
const app = new Koa();

const resolve = (file) => path.resolve(__dirname, file);

app.use(koaStatic(resolve('./dist')));

const { createBundleRenderer } = require('vue-server-renderer');
const bundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');

const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  template: fs.readFileSync(resolve('./src/index.temp.html'), 'utf-8'),
  clientManifest: clientManifest,
});

function renderToString(context) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html);
    });
  });
}

app.use(async (ctx, next) => {
  const context = {
    title: 'ssr test',
    url: ctx.url,
  };
  const html = await renderToString(context);
  ctx.body = html;
});

const port = 3000;
app.listen(port, function() {
  console.log(`server started at localhost:${port}`);
});
