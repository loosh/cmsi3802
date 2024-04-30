import assert from "node:assert/strict";
import parse from "../src/parser.js";
import analyze from "../src/analyzer.js";

// Programs that are semantically correct
const semanticChecks = [
  ["variable declarations", 'x = 5 x = 10 y = + x x'],
  ["increment and decrement", "x = 10 x-- x++ x+=5 x-=5 x*=5 x/=5"],
  ["initialize with empty array", "a = []"],
  ["assign arrays", "b=[1] a=b b=a"],
  ["assign to array element", "a = [1,2,3] a[1]=100 log(a[1])"],
  ["short return", "f test() => r;"],
  ["long return", "f test()=> r true; "],
  ["return in nested if", "f test() => ?true: r;;"],
  ["break in nested if", "w false: ?true: br;;"],
  ["long if", "?true: log(1);!: log(3);"],
  ["elsif", "?true: log(1);!?true: log(0);!: log(3);"],
  ["for over collection", "i in [2,3,5]: log(1);"],
  ["for in range", "i in 1,10: log(0);"],
  ["for in range with step", "i in 1,10,2: log(i);"],
  ["for in range with step as var", "x=2 i in 1,10,x: log(i);"],
  ["repeat", "*.3: a = 1 log(a);"],
  ["try catch", "height = 5 t: ?height < 6: th 'Too Short';;e(error): log(error);"],
  ["conditionals with ints", "log(true ? 8 ! 5)"],
  ["conditionals with floats", "log(1<2 ? 8.0 ! _5.22)"],
  ["conditionals with strings", "log(1<2 ? 'x'! 'y')"],
  ["|", "log(true|1<2|false|~true)"],
  ["&", "log(true&1<2&false&~true)"],
  ["relations", "log(1<=2 & 'x'>'y' & 3.5<1.2)"],
  ["ok to == arrays", "log([1]==[5,8])"],
  ["ok to != arrays", "log([1]~=[5,8])"],
  ["arithmetic", "x=1 log(*2 + 3 - 5^_3/2 % 5 8)"],
  ["array length", "log(#[1,2,3])"],
  ["member exp", "y = {x: 5} log(y.x)"],
  ["optional member exp", "person = {name: 'John'} log(person?.name)"],
  ["subscript exp", "a=[1,2] log(a[0])"],
  ["subscript using member exp", "x={y: 1} a=[1,2] log(a[x.y])"],
  ["array of struct", "x=[{}, {}]"],
  ["outer variable", "x=1 w false: log(x);"],
  ["built-in constants", "log(* 25.0 pi)"],
  ["built-in sin", "log(sin(pi))"],
  ["built-in cos", "log(cos(93.999))"],
  ["built-in hypot", "log(hypot(_4.0, 3.00001))"],
];

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  ["undeclared id", "log(x)", /Identifier x not declared/],
  ["break outside loop", "br", /Break can only appear in a loop/],
  [
    "break inside function",
    "w true: f c() => br;;",
    /Break can only appear in a loop/,
  ],
  [
    "continue inside function",
    "w true: f c() => ct;;",
    /Break can only appear in a loop/,
  ],
  ["return outside function", "r", /Return can only appear in a function/],
  ["call of uncallable", "x = 1 \nlog(x())", /x is not a function/],
  [
    "Too many args",
    "f c(x) => ; c(1,2)",
    /1 argument\(s\) required but 2 passed/,
  ],
  [
    "Too few args",
    "f c(x) => ; c()",
    /1 argument\(s\) required but 0 passed/,
  ]
];

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(parse(source)));
    });
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(parse(source)), errorMessagePattern);
    });
  }
});