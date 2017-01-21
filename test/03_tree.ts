import 'mocha';
import { assert } from 'chai';
import { provide, inject, ready } from '../lib/index';

@provide()
class W {
  @inject()
  public x: X;
}

@provide()
class X {
  @inject()
  public y: Y;
}

@provide()
class Y {
  @inject()
  public z: Z;
}

@provide()
class Z {
  @inject()
  public w: W;
}

describe('DI Tree', () => {
  
  it('inject a tree of providers', () => {
    
    const w: W = new W();

    assert(w, 'w should exist');
    assert(w.x, 'x should exist');
    assert(w.x.y, 'y should exist');
    assert(w.x.y.z, 'z should exist');
    assert(w.x.y.z.w, 'w should exist inside of z');
    
  })

});