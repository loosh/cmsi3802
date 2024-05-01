export class Program {
  constructor(statements) {
    Object.assign(this, { statements });
  }
}

export class VariableDeclaration {
  constructor(variable, value) {
    Object.assign(this, { variable, value });
  }
}

export class Variable {
  constructor(name) {
    Object.assign(this, { name });
  }
}

export class IfStmt {
  constructor(test, consequent, alternate) {
    Object.assign(this, { test, consequent, alternate });
  }
}

export class ShortIfStmt {
  constructor(test, consequent) {
    Object.assign(this, { test, consequent });
  }
}

export class WhileStmt {
  constructor(test, body) {
    Object.assign(this, { test, body });
  }
}

export class PipelineExpression {
  constructor(sequence) {
    this.sequence = sequence;
  }
}

export class PipelineCall {
  constructor(name, paramCount) {
    Object.assign(this, { name, paramCount });
  }
}

export class TryStmt {
  constructor(body, exceptParams, exceptBody) {
    Object.assign(this, { body, exceptParams, exceptBody });
  }
}

export class BreakStmt {
  constructor() { }
}

export class ContinueStmt {
  constructor() { }
}

export class ThrowStmt {
  constructor(exp) {
    Object.assign(this, { exp });
  }
}

export class RepeatStmt {
  constructor(count, body) {
    Object.assign(this, { count, body });
  }
}

export class ForRangeStmt {
  constructor(variable, low, high = null, step = 1, body) {
    this.variable = variable;
    this.low = low;
    this.high = high;
    this.step = step;
    this.body = body;
  }
}

export class ForStmt {
  constructor(iterator, collection, body) {
    Object.assign(this, { iterator, collection, body });
  }

}

export class FunctionDeclaration {
  constructor(func, params, body) {
    Object.assign(this, { func, params, body });
  }
}

export class Func {
  constructor(name, paramCount) {
    Object.assign(this, { name, paramCount });
  }
}

export class CallStmt {
  constructor(call) {
    Object.assign(this, { call });
  }
}

export class FuncCall {
  constructor(name, args) {
    Object.assign(this, { name, args });
  }
}

export class Assignment {
  constructor(target, source) {
    Object.assign(this, { target, source });
  }
}

export class MemberExpression {
  constructor(object, chain, id) {
    Object.assign(this, { object, chain, id });
  }
}

export class Subscript {
  constructor(array, index) {
    Object.assign(this, { array, index });
  }
}

export class ConditionalExpression {
  constructor(test, consequent, alternate) {
    Object.assign(this, { test, consequent, alternate });
  }
}

export class ArrayExpression {
  constructor(elements) {
    this.elements = elements;
  }
}

export class DictExpression {
  constructor(elements) {
    this.elements = elements;
  }
}

export class DictItem {
  constructor(key, value) {
    Object.assign(this, { key, value });
  }
}

export class BinaryExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right });
  }
}

export class UnaryExpression {
  constructor(op, operand) {
    Object.assign(this, { op, operand });
  }
}

export class ReturnStmt {
  constructor(source) {
    this.source = source;
  }
}

export class ShortReturnStmt {
  constructor() { }
}

export const standardLibrary = Object.freeze({
  pi: new Variable("pi", true),
  log: new Func("log", 1),
  sin: new Func("sin", 1),
  cos: new Func("cos", 1),
  exp: new Func("exp", 1),
  ln: new Func("ln", 1),
  hypot: new Func("hypot", 2),
  rev: new Func("rev", 1),
  up: new Func("up", 1),
  low: new Func("low", 1),
  cap: new Func("cap", 1),
  rand: new Func("rand", 1)
});