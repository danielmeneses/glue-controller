# glue-controller

[![npm version](https://img.shields.io/npm/v/glue-controller.svg)](https://npm.im/glue-controller) ![Licence](https://img.shields.io/npm/l/glue-controller.svg) [![Github issues](https://img.shields.io/github/issues/danielmeneses/glue-controller.svg)](https://github.com/danielmeneses/glue-controller/issues) [![Github stars](https://img.shields.io/github/stars/danielmeneses/glue-controller.svg)](https://github.com/danielmeneses/glue-controller/stargazers)

## Goal

The goal of this projet is to deliver a Controller component, for a Node.js environemt, that can be used in a similar way as to a classic MVC framework.

**Note:** The package supports both `express` and `koa` libraries.

### Install

```
npm i glue-controller --save-prod
```

### Basic usage and setup

```js
import Controller from 'glue-controller';
import express from 'express';

class ProductController extends Controller {

  static routesMap = {
    actionCreate: [{ method: 'POST' }]
  };

  actionList(req, res) {
    res.send('Response for "GET /admin/product/list"');
  }

  actionCreate(req, res) {
    res.send('Response for "POST /admin/product/create"');
  }
}

// setup with express
const app = express();
const router = express.Router();

new ProductsController({ router, prefix: 'admin' });

app.use(router);
app.listen(3000);
```

As you can see the above example, the routes path are automatically set by the library based on the given `prefix` (if setted), the controller name and followed by the action name. This feature that is present in a lot of MVC frameworks out there and that keep the application easy to follow through and less verbose.
It's possible to change this behavior as explained bellow.

### Advanced usage

```js
class SiteController extends Controller {

  // middlewares to apply to all actions in the controller
  static middlewares = [authenticationMiddleware];

  // routing configuration
  static routesMap = {
    actionProducts: [
      { method: 'GET' },
      { method: 'POST', delegate: 'createProduct' },
      {
        method: 'PATCH',
        delegate: 'updateProduct',
        path: '/site/products/:id'
      }
    ],
    deleteProduct: [
      {
        method: 'DELETE',
        middlewares: [beforeDeleteMidleware],
        path: '/site/product/:id'
      }
    ]
  };

  actionProducts(req, res) {
    res.send('Response for "GET /site/products"');
  }

  createProduct(req, res) {
    res.send('Response for "POST /site/product"');
  }

  updateProduct(req, res) {
    res.send(`Response for "PATCH /site/product/:id"`);
  }

  deleteProduct() {
    res.send('Response for "POST /site/product/:id"');
  }

}
```

As mentioned before, any method declared in the `Controller` class, that starts with `action` followed by an uppercase character, eg.: `actionProducts`, will be assumed as an action and a new route will be automatically set but it's also possible to change certain behaviors.

You can make use of the static property `routesMap` (`object` type) to configure existing actions or to create new ones. It's importante to note that **all the keys must directly match a specific method name declared in the class**.

As demonstrated in the example above you can mention directly a declared method that doesn't start with `action`. The only difference is that in a non-action name, eg.: `deleteProduct` the route is not automatically set for you, so you always need to set one. None of the approaches is better than other and it's encouraged to interchange the use as needed.


## Controller properties

| Name              | Type     | Visibility | Description                                                                                                        |
|-------------------|----------|-------------|--------------------------------------------------------------------------------------------------------------------|
| `routesMap`         | object   | public static      | Routes configuration. All keys must directlly reference a method declared in the controller (more details bellow). |
| `middlewares`       | array   | public static      | List of middlewares that will run in every action defined in the controller.                                       |
| `getControllerPath` | function | public      | returns the partial controller path (Controller name in kebab-case).                                               |
| `getRouter`         | function | public      | returns the router object (express or koa router).                                                                 |
| `getPrefix`         | function | public      | returns the prefix set when the controller instance was created.                                                   |
| `getControllerName` | function | public      | returns the raw controller name.                                                                                   |

### Static property `routesMap`

| Name          | Type   | Description                                                                                                     |
|---------------|--------|-----------------------------------------------------------------------------------------------------------------|
| `method`      | string | HTTP method/verb                                                                                                |
| `delegate`    | string | Method to delegate the action execution. This method should be declared in the controller or should exist in it's prototype chain. |
| `route`       | string | The route that is passed over to the express or koa router.                                                     |
| `middlewares` | array  | List of middlewares to apply to a specific action.                                                              |


## Contributions

Contributions are very welcome. There's a lot of room for improvements and new features so feel free to fork the repo and get into it. Also, let me know of any bugs you come across, any help on bug fixing is also a plus!
