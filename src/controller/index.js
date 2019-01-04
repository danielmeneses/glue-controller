import { getControllerPath, recurseActions } from './helpers';
import kebabCase from 'just-kebab-case';

class Controller {
  constructor({ router }) {
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

export default Controller;
