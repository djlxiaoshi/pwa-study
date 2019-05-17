const Koa = require('koa');

const app = new Koa();
const koaStatic = require('koa-static');
const Router = require('koa-router');
const router = new Router();

app.use(koaStatic('.'));

router.get('/data', (ctx, next) => {
  return ctx.body = Date.now();
});

router.get('/nochange', (ctx, next) => {
  return ctx.body = ctx.body = Date.now();
});

app.use(router.routes());

app.listen(3000, function () {
  console.log('app is listening on 3000')
});
