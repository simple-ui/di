import 'mocha';
import { assert } from 'chai';
import { di, provide, inject, ready } from '../lib/index';

@provide()
class ServiceA {
  public _1: boolean = false;
  public _2: boolean = false;
  public _B: boolean = false;

  constructor() {
    this._1 = true;
  }

  @ready()
  onReady_forA() {
    this._2 = true;
  }
}

@provide()
class ServiceB {
  public _1: boolean = false;
  public _2: boolean = false;

  @inject()
  public serviceA: ServiceA;

  constructor() {
    this._1 = true;
  }

  @ready()
  onReady_forB() {
    this._2 = true;
    this.serviceA._B = true;
  }
}

describe('DI Demo 01', () => {

  it('order of operations and simple injection', () => {

    const serviceB: ServiceB = di.injectProvider('ServiceB');

    assert(serviceB._1 === true, `ServiceB's constructor function was called`);
    assert(serviceB._2 === true, `ServiceB's ready function was called`);
    assert(serviceB.serviceA._1 === true, `ServiceA's constructor function was called`);
    assert(serviceB.serviceA._2 === true, `ServiceA's ready function was called`);
    assert(serviceB.serviceA._B === true, `ServiceA's flag for B to set was set high`);

  })

});