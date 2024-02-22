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

export class BreakStmt {
  constructor() { }
}

export class ContinueStmt {
  constructor() { }
}

export class ForStmt {
  constructor(variable, start, end, step, body) {
    Object.assign(this, { variable, start, end, step, body });
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

export class RelationalExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right });
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

export class String {
  constructor(value) {
    this.value = value;
  }
}
