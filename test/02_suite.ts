import 'mocha';
import { assert } from 'chai';
import { provide, inject, ready } from '../lib/index';

@provide()
class A {
  public a: number = 2;

  @inject()
  public c: C;
}

@provide()
class C {
  public c: number = 2;

  @inject()
  public a: A;
}

@provide()
class B {
  public hasReadyRun: boolean = false;

  @inject()
  public a: A;

  @inject()
  public c: C;

  @ready()
  whatever() {    
    this.hasReadyRun = true;
  }
}

describe('DI Suite', () => {
  
  it('handle circular injections', () => {
    
    const b: B = new B();

    assert(b, 'b should exist');
    assert(b.a.c === b.c, 'b should have c and a inside of b should have c, which is the same object');
    assert(b.c.a === b.a, 'b should have a and c inside of b should have a, which is the same object');
    
  })

  it('call onReady functions with all providers injected', () => {
    
    const b: any = new B();

    assert(b, 'b should exist');
    assert(b['ready'] === undefined, 'b should not have a ready function');
    assert(b['whatever'] !== undefined, 'b should have a whatever function which is registered as the ready function');
    assert(b.hasReadyRun, 'onReady function should have executed');
    assert((b.a.constructor as any).name === 'A', 'b should have the object provided for A');
    
  })

});