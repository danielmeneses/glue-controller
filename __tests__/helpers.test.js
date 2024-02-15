import {
  getActionPath,
  getControllerPath,
  implodeRoutePaths,
  isAction,
} from '../src/controller/helpers.js';

describe('helper functions', () => {
  it('should return controller url path in kebab-case without `controller` in the name', () => {
    const controllerName = 'SuperHyperMegaLongNameUPPERcaseController';
    const name = getControllerPath(controllerName);

    expect(name).toEqual('super-hyper-mega-long-name-uppe-rcase');
  });

  it('should return action url path in kebab-case without `action` in the name', () => {
    const actionName = 'actionWithSuperHyperMegaLongNameUPPERcase';
    const name = getActionPath(actionName);

    expect(name).toEqual('with-super-hyper-mega-long-name-uppe-rcase');
  });

  it('should return a `string` representing a full uri path in kebab-case for the given partial paths', () => {
    const paths = ['my-prefix', 'my-controller', 'my-action'];
    const name = implodeRoutePaths.apply(null, paths);

    expect(name).toEqual('/my-prefix/my-controller/my-action');
  });

  it('should return `true` if the given `string` value starts with `action` followed by an upper case char', () => {
    const _isAction = isAction(() => {}, 'actionMyCutomAction');

    expect(_isAction).toEqual(true);
  });

  it('should return `false` if the given `string` value doesnt starts with `action` followed by an upper case char', () => {
    const _isAction = isAction(() => {}, 'actionmyCutomAction');

    expect(_isAction).toEqual(false);
  });

  it('should return `false` if the first param isnt a function', () => {
    const _isAction = isAction(null, 'actionmyCutomAction');

    expect(_isAction).toEqual(false);
  });
});
