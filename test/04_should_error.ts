// import 'mocha';
// import { assert } from 'chai';
// import { provide, inject, ready } from '../lib/index';

// @provide()
// class A {
//   public a: number = 2;

//   @inject()
//   public c: C;
// }

// @provide()
// class C {
//   public c: number = 2;

//   @inject()
//   public a: A;
// }

// @provide()
// class B {
//   public h: number = 2;

//   @inject()
//   public a: A;

//   @inject()
//   public c: C;

//   @ready()
//   whatever() {    
//     const isTrue: boolean = (this.a.constructor as any).name === 'A';
//   }
// }

// describe('DI Suite', () => {
  
//   it('register a provider', () => {
    
//     const b: B = new B();

//     assert(b, 'b should exist');
//     assert(b.a.c === b.c, 'b should have c and a inside of b should have c, which is the same object');
//     assert(b.c.a === b.a, 'b should have a and c inside of b should have a, which is the same object');
    
//   })

// });