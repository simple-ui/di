import 'mocha';
import { assert } from 'chai';
import { provide, inject, ready } from '../lib/index';

@provide()
class A {
  @inject()
  public b: B;
}

@provide()
class B {
  @inject()
  public c: C;
}

@provide()
class C {
  @inject()
  public d: D;
}

@provide()
class D {
  @inject()
  public a: A;
}

describe('DI Tree', () => {
  
  it('register a tree of containers', () => {
    
    const a: A = new A();

    assert(a, 'a should exist');
    assert(a.b, 'b should exist');
    assert(a.b.c, 'c should exist');
    assert(a.b.c.d, 'd should exist');
    assert(a.b.c.d.a, 'a should exist inside of d');
    
  })

});