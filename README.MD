# Dependency Injection

[![Coverage Status](https://coveralls.io/repos/github/simple-ui/di/badge.svg?branch=master)](https://coveralls.io/github/simple-ui/di?branch=master)
[![Build Status](https://travis-ci.org/simple-ui/di.svg?branch=master)](https://travis-ci.org/simple-ui/di)
[![Dependency Status](https://david-dm.org/simple-ui/di.svg)](https://david-dm.org/simple-ui/di.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/@simple-ui/di.svg)](https://badge.fury.io/js/@simple-ui/di)

A dependency injection library using TypeScript decorators.

## Install

Install with npm.

```sh
npm install --save @simple-ui/di
```

Install with bower.

```sh
bower install --save @simple-ui/di
```

## Setup

The library uses Decorators to dress classes. To use this library you have to enable `experimentalDecorators` in your _tsconfig.json_ file.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

The library uses ES6 exports for all decorators and the main DI object. To import the full library into a file you can destructure the export object.

```TypeScript
import { di, provide, inject, ready } from '@simple-ui/di';
```

The four object you are injecting are:

| Object     | Purpose
|:-----------|:--------------------------------------------------------------------------------------------------------------------------------
| `di`       | The main DI container
| `provide`  | A decorator to register a provided object
| `inject`   | A decorator to inject a provided object
| `ready`    | A decorator to register a function to call after the constructor when all objects have been injected

## Injecting An Object

While a DI system handles creation of all object, there has to be one object created with starts the process. Here is a contrived example which demonstrates the full capabilities of the library.

```TypeScript
import { di, provide, inject, ready } from '@simple-ui/di';

@provide()
class ServiceA {
  constructor() {
    console.log(`ServiceA exists`);
  }

  @ready()
  onReady_forA() {
    console.log(`ServiceA is ready`);
  }
}

@provide()
class ServiceB {
  
  @inject()
  public serviceA: ServiceA;

  constructor() {
    console.log(`ServiceB exists`);
  }

  @ready()
  onReady_forB() {
    console.log(`ServiceB is ready`);
  }
}

const serviceB: ServiceB = di.injectProvider('ServiceB');
```

Output of this code is, which describes the order of operations, the services are created and then ready functions are called.

```
ServiceB exists
ServiceA exists
ServiceA is ready
ServiceB is ready
```

> The variable of an `@inject()` must be the name of the service with the first letter lowercase.

## DI Containers

The system supports mulitple DI containers for namespacing. There is currently no mechanism to combine two DI namespaces. All providers have been register to the `'global'` namespace so far.

```TypeScript
import { di, provide, inject, ready } from '@simple-ui/di';

@provide('my-namespace')
class A {

}

@provide('my-namespace')
class B {
  @inject('my-namespace')
  public a: A;
}
```

To inject an object with `di` you can use the second parameter to reference a namespace.

```TypeScript
di.injectProvider('InNamespace2', 'namespace-2');
```

## Future Enhancements

A list of future enhancements.

- Connect two or more DI container namespaces