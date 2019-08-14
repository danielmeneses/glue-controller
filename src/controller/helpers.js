import kebabCase from 'just-kebab-case';
import logger from '../utils/logger';

export const isAction = (obj, name) => {
  if (typeof obj !== 'function') return false;

  const nameKebabFormat = kebabCase(name);
  const splittedName = nameKebabFormat.split('-');

  return splittedName.length > 1 && splittedName[0] === 'action' ? true : false;
};

export const implodeRoutePaths = (...paths) => {
  let path = '';

  for (let i = 0; i < paths.length; i++)
    if (paths[i] && typeof paths[i] === 'string') {
      const _path = paths[i].replace(/ /g, '');

      path += `/${_path}`;
    }

  return path;
};

export const getActionPath = name => {
  return kebabCase(name).replace(/^action-/, '');
};

export const getControllerPath = name => {
  return kebabCase(name).replace(/-controller$/, '');
};

const registerRouter = (controller, action, defaultPath) => {
  const { routesMap, middlewares: cMiddlewares } = controller.constructor;
  const routerObj = controller.getRouter();
  const defaultMethod = 'get';

  const controllerMiddlewares =
    cMiddlewares && cMiddlewares.length ? cMiddlewares : [];

  if (
    routesMap &&
    typeof routesMap === 'object' &&
    routesMap.hasOwnProperty(action)
  ) {
    routesMap[action].forEach(item => {
      const path = item.path || defaultPath;
      const method = (item.method || defaultMethod).toLowerCase();
      const middlewares = item.middlewares || [];
      const routeAction = item.delegate || action;

      if (controller.debugMode === true)
        logger.info(
          `${method} ${path} => ${controller.getControllerName()}::${routeAction}`
        );

      routerObj[method].apply(routerObj, [
        path,
        ...[...controllerMiddlewares, ...middlewares],
        controller[routeAction]
      ]);
    });

    return;
  }

  if (isAction(controller[action], action)) {
    if (controller.debugMode === true)
      logger.info(
        `${defaultMethod} ${defaultPath} => ${controller.getControllerName()}::${action}`
      );

    routerObj[defaultMethod].apply(routerObj, [
      defaultPath,
      ...controllerMiddlewares,
      controller[action]
    ]);
  }
};

export const recurseActions = (controllerObj, controllerPath, prefix) => {
  if (controllerObj.debugMode === true)
    logger.info('########### %s', controllerObj.getControllerName());

  const registeredRoutes = [];
  const recurse = obj => {
    const _prototype = Object.getPrototypeOf(obj);
    const keys = Object.getOwnPropertyNames(_prototype);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (typeof _prototype[key] === 'function') {
        const routePath = implodeRoutePaths(
          prefix,
          controllerPath,
          getActionPath(key)
        );

        if (registeredRoutes.indexOf(key) === -1) {
          registerRouter(controllerObj, key, routePath);
          registeredRoutes.push(key);
        }
      }
    }

    if (_prototype.constructor.name !== 'Object') recurse(_prototype);
  };

  recurse(controllerObj);
};
