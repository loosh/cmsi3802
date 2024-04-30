import assert from "node:assert/strict";
import optimize from "../src/optimizer.js";
import * as core from "../src/core.js";

// Make some test cases easier to read
const x = new core.Variable("x");
const a = new core.Variable("a");
const xpp = new core.UnaryExpression("++", x);
const xmm = new core.UnaryExpression("--", x);
const return1p1 = new core.ReturnStmt(new core.BinaryExpression("+", 1, 1));
const return2 = new core.ReturnStmt(2);
const returnX = new core.ReturnStmt(x);
const onePlusTwo = new core.BinaryExpression("+", 1, 2);
const identity = new core.FunctionDeclaration(new core.Func("id", 0), [], { body: returnX });
const intFun = body => new core.FunctionDeclaration(new core.Func("test", 0), [], [body]);
const callIdentity = args => new core.FuncCall(identity?.func?.name, args);
const or = (...d) => d.reduce((x, y) => new core.BinaryExpression("|", x, y));
const and = (...c) => c.reduce((x, y) => new core.BinaryExpression("&", x, y));
const less = (x, y) => new core.BinaryExpression("<", x, y);
const eq = (x, y) => new core.BinaryExpression("==", x, y);
const times = (x, y) => new core.BinaryExpression("*", x, y);
const neg = x => new core.UnaryExpression("_", x);
const array = (...elements) => new core.ArrayExpression(elements);
const assign = (v, e) => new core.Assignment(v, e);
const emptyArray = new core.ArrayExpression([]);
const sub = (a, e) => new core.Subscript(a, e);
const program = statements => new core.Program(statements);

const tests = [
  ["folds +", new core.BinaryExpression("+", 5, 8), 13],
  ["folds -", new core.BinaryExpression("-", 5n, 8n), -3n],
  ["folds *", new core.BinaryExpression("*", 5, 8), 40],
  ["folds /", new core.BinaryExpression("/", 5, 8), 0.625],
  ["folds **", new core.BinaryExpression("^", 5, 8), 390625],
  ["folds %", new core.BinaryExpression("%", 5, 3), 2],
  ["folds <", new core.BinaryExpression("<", 5, 8), true],
  ["folds <=", new core.BinaryExpression("<=", 5, 8), true],
  ["folds ==", new core.BinaryExpression("==", 5, 8), false],
  ["folds !=", new core.BinaryExpression("!=", 5, 8), true],
  ["folds >=", new core.BinaryExpression(">=", 5, 8), false],
  ["folds >", new core.BinaryExpression(">", 5, 8), false],
  ["optimizes +0", new core.BinaryExpression("+", x, 0), x],
  ["optimizes -0", new core.BinaryExpression("-", x, 0), x],
  ["optimizes *1", new core.BinaryExpression("*", x, 1), x],
  ["optimizes /1", new core.BinaryExpression("/", x, 1), x],
  ["optimizes %1", new core.BinaryExpression("%", x, 1), 0],
  ["optimizes 0%", new core.BinaryExpression("%", 0, x), 0],
  ["optimizes *0", new core.BinaryExpression("*", x, 0), 0],
  ["optimizes 0*", new core.BinaryExpression("*", 0, x), 0],
  ["optimizes 0/", new core.BinaryExpression("/", 0, x), 0],
  ["optimizes 0+", new core.BinaryExpression("+", 0, x), x],
  ["optimizes 0-", new core.BinaryExpression("-", 0, x), neg(x)],
  ["optimizes 1*", new core.BinaryExpression("*", 1, x), x],
  ["folds negation", new core.UnaryExpression("_", 8), -8],
  ["optimizes 1^", new core.BinaryExpression("^", 1, x), 1],
  ["optimizes ^0", new core.BinaryExpression("^", x, 0), 1],
  ["optimizes string length", new core.UnaryExpression("#", "hello"), 5],
  ["optimizes negation", new core.UnaryExpression("~", "true"), false],
  ["removes left false from |", or(false, less(x, 1)), less(x, 1)],
  ["removes right false from |", or(less(x, 1), false), less(x, 1)],
  ["removes left true from &", and(true, less(x, 1)), less(x, 1)],
  ["removes right true from &", and(less(x, 1), true), less(x, 1)],
  ["removes x=x at beginning", program([new core.Assignment(x, x), xpp]), program([xpp])],
  ["removes x=x at end", program([xpp, new core.Assignment(x, x)]), program([xpp])],
  ["removes x=x in middle", program([xpp, assign(x, x), xpp]), program([xpp, xpp])],
  ["optimizes if-true", new core.IfStmt(true, [xpp], []), [xpp]],
  ["optimizes if-false", new core.IfStmt(false, [], [xpp]), [xpp]],
  ["optimizes short-if-true", new core.ShortIfStmt(true, [xmm]), [xmm]],
  ["optimizes short-if-false", new core.ShortIfStmt(false, [xpp]), []],
  ["optimizes while-false", program([new core.WhileStmt(false, [xpp])]), program([])],
  ["optimizes repeat-0", program([new core.RepeatStmt(0, [xpp])]), program([])],
  ["optimizes for-range", new core.ForRangeStmt(x, 5, 3, null, [xpp]), []],
  ["optimizes for-empty-array", new core.ForStmt(x, emptyArray, [xpp]), []],
  ["applies if-false after folding", new core.ShortIfStmt(eq(1, 1), [xpp]), [xpp]],
  ["optimizes left conditional true", new core.ConditionalExpression(true, 55, 89), 55],
  ["optimizes left conditional false", new core.ConditionalExpression(false, 55, 89), 89],
  ["optimizes in functions", program([intFun(return1p1)]), program([intFun(return2)])],
  ["optimizes in subscripts", sub(a, onePlusTwo), sub(a, 3)],
  ["optimizes in array literals", array(0, onePlusTwo, 9), array(0, 3, 9)],
  ["optimizes in arguments", callIdentity([times(3, 5)]), callIdentity([15])],
  [
    "passes through nonoptimizable constructs",
    ...Array(2).fill([
      new core.Program([new core.ShortReturnStmt()]),
      new core.VariableDeclaration("x", "z"),
      new core.Assignment(x, new core.BinaryExpression("*", x, "z")),
      new core.Assignment(x, new core.UnaryExpression("~", x)),
      new core.WhileStmt(true, [new core.BreakStmt()]),
      new core.RepeatStmt(5, [new core.ReturnStmt(1)]),
      new core.ConditionalExpression(x, 1, 2),
      new core.IfStmt(x, [], []),
      new core.ShortIfStmt(x, []),
      new core.ForRangeStmt(x, 2, 5, null, []),
      new core.ForStmt(x, array(1, 2, 3), []),
    ]),
  ],
];

describe("The optimizer", () => {
  for (const [scenario, before, after] of tests) {
    it(`${scenario}`, () => {
      assert.deepEqual(optimize(before), after);
    });
  }
});