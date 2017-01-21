import 'mocha';
import { assert } from 'chai';
import { di, provide, inject, ready } from '../lib/index';

@provide('namespace-1')
class InNamespace1A {

}

@provide('namespace-1')
class InNamespace1B {
  @inject('namespace-1')
  public inNamespace1A: InNamespace1A;
}

@provide('namespace-2')
class InNamespace2A {

}

@provide('namespace-2')
class InNamespace2B {
  @inject('namespace-2')
  public inNamespace2A: InNamespace2A;
}

describe('DI Demo 02', () => {

  it('can inject across namespaces', () => {

    const inNamespace1B: InNamespace1B = di.injectProvider('InNamespace1B', 'namespace-1');
    const inNamespace2B: InNamespace2B = di.injectProvider('InNamespace2B', 'namespace-2');

    assert(inNamespace1B.inNamespace1A !== undefined, `can be injected from a different namespace`);
    assert(inNamespace2B.inNamespace2A !== undefined, `can be injected from a different namespace`);
    
  })

});