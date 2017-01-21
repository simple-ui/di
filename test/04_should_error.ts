import 'mocha';
import { assert } from 'chai';
import { provide, inject, ready } from '../lib/index';

class NotRegistered {

}

@provide()
class IsProvided {
  @inject()
  public notRegistered: NotRegistered;
}

describe('DI Errors', () => {

  it('handle errors from unregistered providers', () => {

    try {
      const isProvided: IsProvided = new IsProvided();
    }
    catch (e) {
      if (e instanceof ReferenceError) {
        assert(e.message === `DI: provider NotRegistered has not be registered`, 'should provide a help message if injection fails');
      }
      else {
        assert(false, 'should return a `ReferenceError`');
      }      
    }

  })

});