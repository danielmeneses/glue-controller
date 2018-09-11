import { getControllerPath, recurseActions } from './helpers';
import kebabCase from 'just-kebab-case';

class Controller {
  constructor({ prefix = '', router }) {
    this._prefix = prefix ? kebabCase(prefix) : '';
    this._controllerPath = getControllerPath(this.constructor.name);
    this._router = router;

    recurseActions(this, this._controllerPath, this._prefix);
  }

  getControllerPath() {
    return this._controllerPath;
  }

  getRouter() {
    return this._router;
  }

  getPrefix() {
    return this._prefix;
  }

  getControllerName() {
    return this.constructor.name;
  }
}

export default Controller;
