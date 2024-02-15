import { getControllerPath, recurseActions } from './helpers.js';

export default class Controller {
  constructor({ router, debugMode = false } = {}) {
    this.debugMode = debugMode;
    this._controllerPath = getControllerPath(this.constructor.name);
    this._router = router;

    recurseActions(this, this._controllerPath, this.constructor.prefix);
  }

  getControllerPath() {
    return this._controllerPath;
  }

  getRouter() {
    return this._router;
  }

  /**
   * User implementation
   */
  get prefix() {
    return null;
  }

  getControllerName() {
    return this.constructor.name;
  }
}
