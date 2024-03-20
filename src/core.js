export class Program {
  constructor(statements) {
    Object.assign(this, { statements });
  }
}

export class Assignment {
  constructor(target, source) {
    Object.assign(this, { target, source });
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

export class WhileStmt {
  constructor(test, body) {
    Object.assign(this, { test, body });
  }
}

export class TryStmt {
  constructor(body, except) {
    Object.assign(this, { body, except });
  }
}

export class ExceptStmt {
  constructor(params, body) {
    Object.assign(this, { params, body });
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

export class ForStmt {
  constructor(variable, expression1, expression2, step = 1, body) {
    this.variable = variable; // The loop variable
    this.loopType = expression2 ? 'range' : 'direct'; // Determine loop type based on the presence of expression2
    this.expression1 = expression1; // Start expression for range or the expression for direct
    this.expression2 = expression2 || null; // End expression for range, null for direct
    this.step = step; // Step for range, null if not provided
    this.body = body; // The loop body
  }
}

export class RepeatStmt {
  constructor(count, body) {
    Object.assign(this, { count, body });
  }
}

export class Block {
  constructor(statements) {
    this.statements = statements;
  }
}

export class Variable {
  constructor(name) {
    Object.assign(this, { name });
  }
}

export class IntrinsicFunction {
  constructor(name, parameterCount) {
    Object.assign(this, { name, parameterCount });
  }
}

export class Function {
  constructor(name, parameters, body) {
    Object.assign(this, { name, parameters, body });
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

export class String {
  constructor(value) {
    this.value = value;
  }
}
