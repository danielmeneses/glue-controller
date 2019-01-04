import Controller from '../src';
import express from 'express';

// prepare tests
const fooMiddleware = () => true;
const barMiddleware = () => true;

// main controller class
class FoobarController extends Controller {
  static routesMap = {
    actionQuux: [
      { method: 'POST', path: '/my-prefix/foo-post/:id' },
      {
        delegate: 'quuxPatch',
        method: 'PATCH',
        path: '/my-prefix/foo-patch/:id'
      }
    ],
    actionQux: [{ middlewares: [fooMiddleware] }]
  };

  actionQuux() {}
  actionQux() {}
  actionWaldo() {}
  quuxPatch() {}

  static get prefix() {
    return 'waldo-prefix';
  }
}

// extended controller class
class FoobizController extends FoobarController {
  static middlewares = [barMiddleware];

  static routesMap = {
    ...FoobarController.routesMap,
    customFoo: [{ method: 'post', path: '/custom/foo' }]
  };

  actionWaldo() {}
  actionFoo() {}
  customFoo() {}
  helperFunction() {}

  static get prefix() {
    return null;
  }
}

describe('Express - test Controller class', () => {
  let router = null;
  let app = null;

  beforeEach(() => {
    app = express();
    router = express.Router();

    app.use(router);
  });

  it('should return all existing routes based on the actions names in the FoobarController', () => {
    {
      new FoobarController({ router });

      const routers = router.stack;
      const routersData = routers.map(route => {
        const {
          route: { methods, path, stack }
        } = route;

        return {
          methods,
          middlewares: stack.map(item => item.handle),
          path
        };
      });

      expect(routers).toHaveLength(4);
      expect(routersData).toEqual([
        {
          methods: { post: true },
          middlewares: [FoobarController.prototype.actionQuux],
          path: '/my-prefix/foo-post/:id'
        },
        {
          methods: { patch: true },
          middlewares: [FoobarController.prototype.quuxPatch],
          path: '/my-prefix/foo-patch/:id'
        },
        {
          methods: { get: true },
          middlewares: [fooMiddleware, FoobarController.prototype.actionQux],
          path: '/waldo-prefix/foobar/qux'
        },
        {
          methods: { get: true },
          middlewares: [FoobarController.prototype.actionWaldo],
          path: '/waldo-prefix/foobar/waldo'
        }
      ]);
    }
  });

  it('should return all existing routes based on the actions names in the FoobizController that extends FoobarController', () => {
    {
      new FoobizController({ router });

      const routers = router.stack;
      const routersData = routers.map(route => {
        const {
          route: { methods, path, stack }
        } = route;

        return {
          methods,
          middlewares: stack.map(item => item.handle),
          path
        };
      });

      expect(routers).toHaveLength(6);
      expect(routersData).toEqual([
        {
          methods: { get: true },
          middlewares: [barMiddleware, FoobizController.prototype.actionWaldo],
          path: '/foobiz/waldo'
        },
        {
          methods: { get: true },
          middlewares: [barMiddleware, FoobizController.prototype.actionFoo],
          path: '/foobiz/foo'
        },
        {
          methods: { post: true },
          middlewares: [barMiddleware, FoobizController.prototype.customFoo],
          path: '/custom/foo'
        },
        {
          methods: { post: true },
          middlewares: [barMiddleware, FoobizController.prototype.actionQuux],
          path: '/my-prefix/foo-post/:id'
        },
        {
          methods: { patch: true },
          middlewares: [barMiddleware, FoobizController.prototype.quuxPatch],
          path: '/my-prefix/foo-patch/:id'
        },
        {
          methods: { get: true },
          middlewares: [
            barMiddleware,
            fooMiddleware,
            FoobizController.prototype.actionQux
          ],
          path: '/foobiz/qux'
        }
      ]);
    }
  });

  it('FoobarController getters should return expected values', () => {
    const fooController = new FoobarController({ router });

    expect(fooController.getControllerName()).toEqual('FoobarController');
    expect(fooController.getControllerPath()).toEqual('foobar');
    expect(FoobarController.prefix).toEqual('waldo-prefix');
    expect(fooController.getRouter()).toEqual(router);
  });
});
