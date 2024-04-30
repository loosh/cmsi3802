import assert from 'node:assert/strict';
import parse from '../src/parser.js';
import analyze from '../src/analyzer.js';
import optimize from '../src/optimizer.js';
import generate from '../src/generator.js';

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, '').trim();
}

const fixtures = [
  {
    name: 'small',
    source: `
      x = * 3 7
      x++
      x--
      y = true
      y = / 5^_x  _100 > _x | false
      log(y & y | false | *x 2 ~= 5)
    `,
    expected: dedent`
      let x = 21;
      x++;
      x--;
      let y = true;
      y = (((5 ** -(x)) / -100) > -(x));
      console.log(((y && y) || ((x * 2) != 5)));
    `,
  },
  {
    name: 'vars',
    source: `
      x = 5
      x = 10
      ?x == 5: y = 10;
      y = 5
    `,
    expected: dedent`
      let x = 5;
      x = 10;
      if ((x == 5)) {
        let y = 10;
      }
      let y = 5;
    `,
  },
  {
    name: 'if',
    source: `
      x = 0
      ?x==0: log('1');
      ?x==0: log(1);!: log(2);
      ?x==0: log(1);!?x==2: log(3);
      ?x==0: log(1);!?x==2: log(3);!: log(4);
    `,
    expected: dedent`
      let x = 0;
      if ((x == 0)) {
        console.log('1');
      }
      if ((x == 0)) {
        console.log(1);
      } else {
        console.log(2);
      }
      if ((x == 0)) {
        console.log(1);
      } else
        if ((x == 2)) {
          console.log(3);
        }
      if ((x == 0)) {
        console.log(1);
      } else
        if ((x == 2)) {
          console.log(3);
        } else {
          console.log(4);
        }
    `,
  },
  {
    name: 'while',
    source: `
      x = 0
      w x < 5:
        y = 0
        w y < 5:
          log(*x y)
          y = + y 1
          br;
        x = +x 1;
    `,
    expected: dedent`
      let x = 0;
      while ((x < 5)) {
        let y = 0;
        while ((y < 5)) {
          console.log((x * y));
          y = (y + 1);
          break;
        }
        x = (x + 1);
      }
    `,
  },
  {
    name: 'functions',
    source: `
      z = 0.5
      f one(x, y) =>
        log(sin(x) > pi)
        r
      ;
      f two() =>
        r false
      ;
      one(z, two())
    `,
    expected: dedent`
      let z = 0.5;
      function one(x, y) {
        console.log((Math.sin(x) > Math.PI));
        return;
      }
      function two() {
        return false;
      }
      one(z, two());
    `,
  },
  {
    name: 'arrays',
    source: `
      a = [true, false, true]
      b = [10, -#a 20, 30]
      c = []
      log(a[1] |  (false ? b[0] < 88 ! true))
    `,
    expected: dedent`
      let a = [true,false,true];
      let b = [10,(a.length - 20),30];
      let c = [];
      console.log((a[1] || (((b[0] < 88)) ? (false) : (true))));
    `,
  },
  {
    name: 'members',
    source: `
    person = {
      name: 'John',
      age: 30,
      address: {
        street: '123 Main St'
      }
    }
    log(person?.address?.street)
    log(person['name'][0])
    `,
    expected: dedent`
      let person = {name: 'John', age: 30, address: {street: '123 Main St'}};
      console.log(person?.address?.street);
      console.log(person['name'][0]);
    `,
  },
  {
    name: 'for loops',
    source: `
      i in 1,50:
        log(i);

      j in [10, 20, 30]:
        log(j);

      *.3:
        // hello
        log('hello')
      ;

      k in 1,10,2: ;
    `,
    expected: dedent`
      for (let i = 1; i < 50; i += 1) {
        console.log(i);
      }
      for (let j of [10,20,30]) {
        console.log(j);
      }
      for (let i_1 = 0; i_1 < 3; i_1++) {
        console.log('hello');
      }
      for (let k = 1; k < 10; k += 2) {
      }
    `,
  },
  {
    name: 'standard library',
    source: `
      x = 0.5
      log(-sin(x) + cos(x) *exp(x)  / ln(x)  hypot(2.3, x))
    `,
    expected: dedent`
      let x = 0.5;
      console.log((Math.sin(x) - (Math.cos(x) + (Math.exp(x) * (Math.log(x) / Math.hypot(2.3,x))))));
    `,
  },
  {
    name: 'if',
    source: `
    x = 5
    ?x < 5 | _x > 5: log('x is less than 5');
    !? x > 5: log('x is greater than 5');
    !: log('x is equal to 5');`,
    expected: dedent`
      let x = 5;
      if (((x < 5) || (-(x) > 5))) {
        console.log('x is less than 5');
      } else
        if ((x > 5)) {
          console.log('x is greater than 5');
      } else {
        console.log('x is equal to 5');
      }
    `,
  },
  {
    name: 'recursive gcd',
    source: `
    f gcd(a,b) =>
    ?b==0: r a;
    !: r gcd(b, % a b);;`,
    expected: dedent`
      function gcd(a, b) {
        if ((b == 0)) {
          return a;
        } else {
          return gcd(b, (a % b));
        }
      }
    `
  },
  {
    name: 'factorial',
    source: `
    f factorial(n) =>
    ?n==0: r 1;
    !: r * n factorial(-n 1);;`,
    expected: dedent`
      function factorial(n) {
        if ((n == 0)) {
          return 1;
        } else {
          return (n * factorial((n - 1)));
        }
      }
    `
  },
  {
    name: 'fibonacci',
    source: `
    f fibonacci(n) =>
      ?n < 2: r n;
      !: r + fibonacci(-n 1) fibonacci(-n 2);;`,
    expected: dedent`
      function fibonacci(n) {
        if ((n < 2)) {
          return n;
        } else {
          return (fibonacci((n - 1)) + fibonacci((n - 2)));
        }
      }
    `
  },
  {
    name: 'repeat',
    source: `*.5: log('This will run 5 times');`,
    expected: dedent`
      for (let i_1 = 0; i_1 < 5; i_1++) {
        console.log('This will run 5 times');
      }
    `
  },
  {
    name: 'string loop',
    source: `
      i in 1,10:
        ?*i 2 == 6: ct;
        log(*i 10);
          
      s = 'hello'

      i in 0,#s: log(s[i]);

      i in s: log(i);
    `,
    expected: dedent`
      for (let i = 1; i < 10; i += 1) {
        if (((i * 2) == 6)) {
          continue;
        }
        console.log((i * 10));
      }
      let s = 'hello';
      for (let i = 0; i < s.length; i += 1) {
        console.log(s[i]);
      }
      for (let i of s) {
        console.log(i);
      }
    `
  },
  {
    name: 'string loop',
    source: `
      arr = [1, 2, 3, 4, 5]
      arr[0] = 10
      arr[1] = arr[0]
    `,
    expected: dedent`
      let arr = [1,2,3,4,5];
      arr[0] = 10;
      arr[1] = arr[0];
    `
  },
  {
    name: 'function name',
    source: `
      f test(a) =>
        r a ~= 5F;
      log(test)
    `,
    expected: dedent`
      function test(a) {
        return (a != Array.from({ length: 5 }, (_, i) => i + 1).reduce((a, b) => a * b, 1));
      }
      console.log(test);
    `
  },
  {
    name: 'try catch',
    source: `
    height = 5
    t: ?height < 6: th 'Too Short';;
    e(error): log(error);
    `,
    expected: dedent`
      let height = 5;
      try {
        if ((height < 6)) {
          throw 'Too Short';
        }
      } catch (error) {
        console.log(error);
      }
    `
  }
];

describe('The code generator', () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(optimize(analyze(parse(fixture.source))));
      assert.deepEqual(actual, fixture.expected);
    });
  }
});