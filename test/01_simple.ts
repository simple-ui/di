import 'mocha';
import { assert } from 'chai';
import { di, provide, inject, ready } from '../lib/index';

@provide()
class P1 {

}

@provide()
class P2 {

}

describe('DI Simple', () => {
  
  it('register a provider', () => {
    
    assert(di.hasProvider('P1'), 'P1 should be registered');
    assert(di.hasProvider('P2'), 'P2 should be registered');

  })

});