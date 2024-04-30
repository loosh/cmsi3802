import assert from 'node:assert/strict';
import parse from '../src/parser.js';
import analyze from '../src/analyzer.js';
import optimize from '../src/optimizer.js';
import generate from '../src/generator.js';

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, '').trim();
}

const fixtures = [
  // {
  //   name: 'small',
  //   source: `
  //     x = * 3 7
  //     x++
  //     x--
  //     y = true
  //     y = / 5^_x  _100 > _x | false
  //     log(y & y | false | *x 2 ~= 5)
  //   `,
  //   expected: dedent`
  //     let x = 21;
  //     x++;
  //     x--;
  //     let y = true;
  //     y = (((5 ** -(x)) / -100) > -(x));
  //     console.log(((y && y) || ((x * 2) != 5)));
  //   `,
  // },
  // {
  //   name: 'vars',
  //   source: `
  //     x = 5
  //     ?x == 5: y = 10;
  //     y = 5
  //   `,
  //   expected: dedent`
  //     let x = 5;
  //     if ((x == 5)) {
  //       let y = 10;
  //     }
  //     let y = 5;
  //   `,
  // },
  // {
  //   name: 'if',
  //   source: `
  //     x = 0
  //     ?x==0: log('1');
  //     ?x==0: log(1);!: log(2);
  //     ?x==0: log(1);!?x==2: log(3);
  //     ?x==0: log(1);!?x==2: log(3);!: log(4);
  //   `,
  //   expected: dedent`
  //     let x = 0;
  //     if ((x == 0)) {
  //       console.log('1');
  //     }
  //     if ((x == 0)) {
  //       console.log(1);
  //     } else {
  //       console.log(2);
  //     }
  //     if ((x == 0)) {
  //       console.log(1);
  //     } else
  //       if ((x == 2)) {
  //         console.log(3);
  //       }
  //     if ((x == 0)) {
  //       console.log(1);
  //     } else
  //       if ((x == 2)) {
  //         console.log(3);
  //       } else {
  //         console.log(4);
  //       }
  //   `,
  // },
  // {
  //   name: 'while',
  //   source: `
  //     x = 0
  //     w x < 5:
  //       y = 0
  //       w y < 5:
  //         log(*x y)
  //         y = + y 1
  //         br;
  //       x = +x 1;
  //   `,
  //   expected: dedent`
  //     let x = 0;
  //     while ((x < 5)) {
  //       let y = 0;
  //       while ((y < 5)) {
  //         console.log((x * y));
  //         y = (y + 1);
  //         break;
  //       }
  //       x = (x + 1);
  //     }
  //   `,
  // },
  {
    name: 'std',
    source: `
      log(sin(5) > pi)
    `,
    expected: dedent`
      console.log(Math.sin(5) > Math.PI)!;
    `,
  }
  // {
  //   name: 'functions',
  //   source: `
  //     z = 0.5
  //     f one(x, y) =>
  //       log(sin(x) > pi)
  //       r
  //     ;
  //     f two() =>
  //       r false
  //     ;
  //     one(z, two())
  //   `,
  //   expected: dedent`
  //     let z = 0.5;
  //     function one(x, y) {
  //       console.log((Math.sin(x) > Math.PI));
  //       return;
  //     }
  //     function two() {
  //       return false;
  //     }
  //     one(z, two());
  //   `,
  // },
  // {
  //   name: 'arrays',
  //   source: `
  //     let a = [true, false, true];
  //     let b = [10, #a - 20, 30];
  //     const c = [[int]]();
  //     const d = random b;
  //     print(a[1] || (b[0] < 88 ? false : true));
  //   `,
  //   expected: dedent`
  //     let a_1 = [true,false,true];
  //     let b_2 = [10,(a_1.length - 20),30];
  //     let c_3 = [];
  //     let d_4 = ((a=>a[~~(Math.random()*a.length)])(b_2));
  //     console.log((a_1[1] || (((b_2[0] < 88)) ? (false) : (true))));
  //   `,
  // },
  // {
  //   name: 'structs',
  //   source: `
  //     struct S { x: int }
  //     let x = S(3);
  //     print(x.x);
  //   `,
  //   expected: dedent`
  //     class S_1 {
  //     constructor(x_2) {
  //     this['x_2'] = x_2;
  //     }
  //     }
  //     let x_3 = new S_1(3);
  //     console.log((x_3['x_2']));
  //   `,
  // },
  // {
  //   name: 'optionals',
  //   source: `
  //     let x = no int;
  //     let y = x ?? 2;
  //     struct S {x: int}
  //     let z = some S(1);
  //     let w = z?.x;
  //   `,
  //   expected: dedent`
  //     let x_1 = undefined;
  //     let y_2 = (x_1 ?? 2);
  //     class S_3 {
  //     constructor(x_4) {
  //     this['x_4'] = x_4;
  //     }
  //     }
  //     let z_5 = new S_3(1);
  //     let w_6 = (z_5?.['x_4']);
  //   `,
  // },
  // {
  //   name: 'for loops',
  //   source: `
  //     for i in 1..<50 {
  //       print(i);
  //     }
  //     for j in [10, 20, 30] {
  //       print(j);
  //     }
  //     repeat 3 {
  //       // hello
  //     }
  //     for k in 1...10 {
  //     }
  //   `,
  //   expected: dedent`
  //     for (let i_1 = 1; i_1 < 50; i_1++) {
  //       console.log(i_1);
  //     }
  //     for (let j_2 of [10,20,30]) {
  //       console.log(j_2);
  //     }
  //     for (let i_3 = 0; i_3 < 3; i_3++) {
  //     }
  //     for (let k_4 = 1; k_4 <= 10; k_4++) {
  //     }
  //   `,
  // },
  // {
  //   name: 'standard library',
  //   source: `
  //     let x = 0.5;
  //     print(sin(x) - cos(x) + exp(x) * ln(x) / hypot(2.3, x));
  //     print(bytes('∞§¶•'));
  //     print(codepoints('💪🏽💪🏽🖖👩🏾💁🏽‍♀️'));
  //   `,
  //   expected: dedent`
  //     let x_1 = 0.5;
  //     console.log(((Math.sin(x_1) - Math.cos(x_1)) + ((Math.exp(x_1) * Math.log(x_1)) / Math.hypot(2.3,x_1))));
  //     console.log([...Buffer.from('∞§¶•', 'utf8')]);
  //     console.log([...('💪🏽💪🏽🖖👩🏾💁🏽‍♀️')].map(s=>s.codePointAt(0)));
  //   `,
  // },
];

describe('The code generator', () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(optimize(analyze(parse(fixture.source))));
      assert.deepEqual(actual, fixture.expected);
    });
  }
});