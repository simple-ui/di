//// Helper Methods

const capitalize = function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const buildProvisionedSpec = (spec: any): any => {
  return new spec();
};

//// Helper Types

// to stop TS from complaining on build
type Record<K, T> = {
  [key: string]: T;
};

/**
 * A record for one provisioned object storing type, name, and actual reference
 */
interface IProvisionType {
  name: string;
  is: any;
  of: any;
};

/**
 * A record for one injection request between two objects
 */
interface IInjectionRequest {
  instanceName: string;
  of: string;
}

/**
 * The DI master set which holds all containers
 */
class DI {

  private _sets: Record<string, DINamespace> = {};

  constructor() {
    this._sets['global'] = new DINamespace();
  }

  of(diGroupName: string = 'global'): DINamespace {
    this._sets[diGroupName] = this._sets[diGroupName] || new DINamespace();
    return this._sets[diGroupName];
  }

  hasProvider(providerName: string, diGroupName: string = 'global'): boolean {
    return this.of(diGroupName).hasProvider(providerName);
  }

  injectProvider(providerName: string, diGroupName: string = 'global'): any {
    return this.of(diGroupName).injectProvider(providerName);
  }

}

/**
 * A DI Container which holds all objects and injection requests between objects
 */
class DINamespace {

  private _injectionRequests: Record<string, Record<string, IInjectionRequest>> = {};
  private _providers: Record<string, IProvisionType> = {};
  private _onReadyCallbacks: Record<string, string> = {};

  /**
   * detect if a provider is registered
   */
  hasProvider(providerName: string): boolean {
    return this._providers[providerName] !== undefined;
  }

  /**
   * register one provider
   */
  registerProvider<T>(providedType: T, providedName: string): T {

    this._providers[providedName] = this._providers[providedName] || {
      name: providedName,
      of: providedType,
      is: undefined
    };

    return providedType;
  }

  /**
   * register a callback when the provider is invoked and has all injection requests, takes the place of a constructor call
   * @note when the constructor is called, the injections have not happened yet
   */
  registerOnReady(targetName: string, onProvisioned: string, providerName: string): void {
    this._onReadyCallbacks[targetName] = onProvisioned;
  }

  /**
   * adds one injection request entry, this cannot be associated with the providers, they are called before providers are registered
   */
  registerInjectionRequest(targetName: string, assignToName: string, providerName: string): void {
    this._injectionRequests[targetName] = this._injectionRequests[targetName] || {};
    this._injectionRequests[targetName][providerName] = {
      instanceName: assignToName,
      of: providerName
    };
  }

  /**
   * call onReady callback if registered for object
   */
  startup<T extends any>(o: T, providerName: string): T {

    const provisionedName: string = this._onReadyCallbacks[providerName];

    if (!!provisionedName && typeof o[provisionedName] === 'function') {
      o[provisionedName]();
    }

    return o;
  }

  /**
   * when injecting an object, inject all objects that it requests
   */
  inject<T extends any>(o: T, providerName: string): T {

    const typeRequests: Record<string, IInjectionRequest> = this._injectionRequests[providerName];
    const typeInfo: IProvisionType = this._providers[providerName];

    typeInfo.is = o;

    for (let key in typeRequests) {
      o[typeRequests[key].instanceName] = this.injectProvider(typeRequests[key].of);
    }

    return o;
  }

  /**
   * return an existing object or create the object and return it
   */
  public injectProvider(providerName: string): any {
    const provider: IProvisionType = this._providers[providerName];

    if (!provider) {
      throw new ReferenceError(`DI: provider ${providerName} has not be registered`);
    }

    return provider.is = ((provider.is)
      ? provider.is
      : buildProvisionedSpec(provider.of));
  }
}

/**
 * 
 */
export const di: DI = new DI();

/**
 * 
 */
export function provide(diGroupName?: string) {
  return function (target: any): any {

    const providerName: string = capitalize(target.name);
    const _di: DINamespace = di.of(diGroupName);

    // TODO add this to DINamespace for proper layering of API
    const injectReadyTarget = function (): any {
      return _di.startup(_di.inject(buildProvisionedSpec(target), providerName), providerName);
    };

    return _di.registerProvider(injectReadyTarget, providerName);
  }
}

/**
 * 
 */
export function inject(diGroupName?: string) {
  return function (target: any, propertyKey: string): any {
    di.of(diGroupName).registerInjectionRequest(target.constructor.name, propertyKey, capitalize(propertyKey));
  };
};

/**
 * 
 */
export function ready(diGroupName?: string) {
  return function (target: any, propertyKey: string): any {
    di.of(diGroupName).registerOnReady(target.constructor.name, propertyKey, capitalize(propertyKey));
  };
};
