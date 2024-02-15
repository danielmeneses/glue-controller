import Controller from '../src/index.js';
import express from 'express';
import logger from '../src/utils/logger.js';

class MainController extends Controller {
  actionHere(req, res) {
    res.send('Here');
  }
}

class MyController extends MainController {
  static routesMap = {
    actionHere: [
      {
        middlewares: [
          (r, s, n) => {
            logger.info('This a middleware!!');
            n();
          },
        ],
        path: '/my/here-we-go',
      },
    ],
    actionTestPost: [
      {
        method: 'POST',
        path: `/my/post/:id`,
      },
    ],
    anotherAction: [
      {
        method: 'get',
        path: `/another/action`,
      },
    ],
  };

  actionTest(req, res) {
    res.send('Test');
  }

  actionTestPost(req, res) {
    res.send('Test post');
  }

  actionHere(req, res) {
    res.send('Here 2');
  }

  anotherAction(req, res) {
    res.send('Another action');
  }
}

const app = express();
const router = express.Router();

app.use(router);

new MyController({ prefix: 'my-prefix', router });

const port = 3000;

app.listen(port, () => {
  logger.info(`Server started ${port}`);
});
