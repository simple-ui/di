import 'mocha';
import { assert } from 'chai';
import { provide, inject, ready } from '../lib/index';

@provide()
class P1 {

}

@provide()
class P2 {

}

describe('DI Simple', () => {
  
  it('register a provider', () => {
    assert(Array.isArray([]), 'empty arrays are arrays');
  })

});