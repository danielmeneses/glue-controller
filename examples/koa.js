import Controller from '../src/index.js';
import Koa from 'koa';
import Router from 'koa-router';
import logger from '../src/utils/logger.js';

class MainController extends Controller {
  actionHere(ctx) {
    ctx.body = 'Here';
  }
}

class MyController extends MainController {
  static routesMap = {
    here: [{ path: '/my/here-we-go' }],
    testPost: [
      {
        method: 'POST',
        path: `/my/post/:id`,
      },
    ],
  };

  actionTest(ctx) {
    ctx.body = 'Test';
  }

  actionTestPost(ctx) {
    ctx.body = 'Test post';
  }

  actionHere(ctx) {
    ctx.body = 'Here 2';
  }
}

const app = new Koa();
const router = new Router();

app.use(router.routes());

new MyController({ prefix: 'my-prefix', router });

const port = 3000;

app.listen(port, () => {
  logger.info(`Server started ${port}`);
});
