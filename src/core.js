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


export class PrintStmt {
  constructor(argument) {
    this.argument = argument;
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
  constructor(variable, expression1, expression2, step = 1, body) {
    this.variable = variable; // The loop variable
    this.expression1 = expression1; // Start expression for range or the expression for direct
    this.expression2 = expression2 || null; // End expression for range, null for direct
    this.step = step; // Step for range, null if not provided
    this.body = body; // The loop body
  }
}

export class ForStmt {
  constructor(iterator, collection, body) {
    Object.assign(this, { iterator, collection, body });
  }

}

export class Block {
  constructor(statements) {
    this.statements = statements;
  }
}

export class IntrinsicFunction {
  constructor(name, parameterCount) {
    Object.assign(this, { name, parameterCount });
  }
}

export class FunctionDeclaration {
  constructor(func, params, body) {
    Object.assign(this, { func, params, body });
  }
}

export class Func {
  constructor(name) {
    Object.assign(this, { name });
  }
}

export class Param {
  constructor(name) {
    Object.assign(this, { name });
  }
}

export class FuncCall {
  constructor(name, args) {
    Object.assign(this, { name, args });
  }
}

export class AccessExpression {
  constructor(id, index) {
    Object.assign(this, { id, index });
  }
}

export class ConditionalExpression {
  constructor(test, consequent, alternate) {
    Object.assign(this, { test, consequent, alternate });
  }
}

export class RelationalExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right });
  }
}

export class LogicalExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right });
  }
}

export class ArrayExpression {
  constructor(elements) {
    this.elements = elements;
  }
}

export class DictExpression {
  constructor(elements) {
    // elements is a list of dict items
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

export class Number {
  constructor(value) {
    this.value = value;
  }
}

export class ReturnStmt {
  constructor(source) {
    this.source = source;
  }
}

export class ShortReturnStatement {
  constructor() { }
}

export class String {
  constructor(value) {
    this.value = value;
  }
}

export const boolType = { kind: "BoolType" };
export const intType = { kind: "IntType" };
export const floatType = { kind: "FloatType" };
export const stringType = { kind: "StringType" };
export const voidType = { kind: "VoidType" };
export const anyType = { kind: "AnyType" };

export const standardLibrary = Object.freeze({
  int: intType,
  float: floatType,
  boolean: boolType,
  string: stringType,
  void: voidType,
  any: anyType,
  π: new Variable("π", true),
  print: new Function("print"),
  sin: new Function("sin"),
  cos: new Function("cos"),
  exp: new Function("exp"),
  ln: new Function("ln"),
  hypot: new Function("hypot"),
  bytes: new Function("bytes"),
  codepoints: new Function("codepoints")
});