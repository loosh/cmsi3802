// The optimizer module exports a single function, optimize(node), to perform
// machine-independent optimizations on the analyzed semantic representation.
//
// The only optimizations supported here are:
//
//   - assignments to self (x = x) turn into no-ops
//   - constant folding
//   - some strength reductions (+0, -0, *0, *1, etc.)
//   - turn references to built-ins true and false to be literals
//   - remove all disjuncts in || list after literal true
//   - remove all conjuncts in && list after literal false
//   - while-false becomes a no-op
//   - repeat-0 is a no-op
//   - for-loop over empty array is a no-op
//   - for-loop with low > high is a no-op
//   - if-true and if-false reduce to only the taken arm
//
// The optimizer also replaces token references with their actual values,
// since the original token line and column numbers are no longer needed.
// This simplifies code generation.

import * as core from "./core.js";
import util from "util";

export default function optimize(node) {
  return optimizers?.[node?.constructor?.name]?.(node) ?? node;
}

const optimizers = {
  Program(p) {
    p.statements = p.statements.flatMap(optimize);
    return p;
  },
  VariableDeclaration(d) {
    d.variable = optimize(d.variable);
    d.value = optimize(d.value);
    return d;
  },
  FunctionDeclaration(d) {
    if (d.body) d.body = d.body.flatMap(optimize);
    return d;
  },
  UnaryExpression(e) {
    e.op = optimize(e.op);
    e.operand = optimize(e.operand);
    if (e.operand.constructor === Number && e.op === "_") {
      return -e.operand;
    }
    if (e.operand.constructor === String && e.op === "#") {
      return e.operand.length;
    }
    if (e.op === "~") {
      return !e.operand;
    }
  },
  BreakStmt(s) {
    return s;
  },
  ReturnStmt(s) {
    s.source = optimize(s.source);
    return s;
  },
  ShortReturnStmt(s) {
    return s;
  },
  Assignment(s) {
    s.target = optimize(s.target);
    s.source = optimize(s.source);
    if (s.target === s.source) {
      return [];
    }
    return s;
  },
  IfStmt(s) {
    s.test = optimize(s.test);
    s.consequent = s.consequent.flatMap(optimize);
    if (s.alternate?.constructor?.name?.endsWith?.("IfStmt")) {
      s.alternate = optimize(s.alternate);
    } else {
      s.alternate = s.alternate.flatMap(optimize);
    }
    if (s.test.constructor === Boolean) {
      return s.test ? s.consequent : s.alternate;
    }
    return s;
  },
  ShortIfStmt(s) {
    s.test = optimize(s.test);
    s.consequent = s.consequent.flatMap(optimize);
    if (s.test.constructor === Boolean) {
      return s.test ? s.consequent : [];
    }
    return s;
  },
  WhileStmt(s) {
    s.test = optimize(s.test);
    if (s.test === false) {
      return [];
    }
    s.body = s.body.flatMap(optimize);
    return s;
  },
  RepeatStmt(s) {
    s.count = optimize(s.count);
    if (s.count === 0) {
      return [];
    }
    s.body = s.body.flatMap(optimize);
    return s;
  },
  ForRangeStmt(s) {
    s.variable = optimize(s.variable);
    s.low = optimize(s.low);
    s.high = optimize(s.high);
    if (s.low.constructor === Number) {
      if (s.high.constructor === Number) {
        if (s.low > s.high) {
          return [];
        }
      }
    }
    s.body = s.body.flatMap(optimize);
    return s;
  },
  ForStmt(s) {
    s.iterator = optimize(s.iterator);
    s.collection = optimize(s.collection);
    if (s.collection.constructor.name == 'ArrayExpression' && s.collection.elements.length == 0) {
      return [];
    }
    s.body = s.body.flatMap(optimize);
    return s;
  },
  ConditionalExpression(e) {
    e.test = optimize(e.test);
    e.consequent = optimize(e.consequent);
    e.alternate = optimize(e.alternate);
    if (e.test.constructor === Boolean) {
      return e.test ? e.consequent : e.alternate;
    }
    return e;
  },
  BinaryExpression(e) {
    e.op = optimize(e.op);
    e.left = optimize(e.left);
    e.right = optimize(e.right);

    if (e.op == "&") {
      if (e.left == true) return e.right;
      if (e.right == true) return e.left;
    }

    if (e.op == "|") {
      if (e.left == false) return e.right;
      if (e.right == false) return e.left;
    }

    if ([Number, BigInt].includes(e.left.constructor)) {
      if ([Number, BigInt].includes(e.right.constructor)) {
        if (e.op == "+") return e.left + e.right;
        if (e.op == "-") return e.left - e.right;
        if (e.op == "*") return e.left * e.right;
        if (e.op == "/") return e.left / e.right;
        if (e.op == "^") return e.left ** e.right;
        if (e.op == "<") return e.left < e.right;
        if (e.op == "<=") return e.left <= e.right;
        if (e.op == "==") return e.left == e.right;
        if (e.op == "!=") return e.left != e.right;
        if (e.op == ">=") return e.left >= e.right;
        if (e.op == ">") return e.left > e.right;
        if (e.op == "%") return e.left % e.right;
      } else {
        if (e.left == 0 && e.op == "+") return e.right;
        if (e.left == 1 && e.op == "*") return e.right;
        if (e.left == 0 && ['*', '/', '^', '%'].includes(e.op)) return 0;
        if (e.left == 1 && e.op == "^") return 1;
        if (e.left == 0 && e.op == "-") return new core.UnaryExpression("_", e.right);
      }
    }
    else if ([Number, BigInt].includes(e.right.constructor)) {
      if (["+", "-"].includes(e.op) && e.right === 0) return e.left;
      if (["*", "/"].includes(e.op) && e.right === 1) return e.left;
      if (e.op == '%' && e.right === 1) return 0;
      if (e.op === "*" && e.right === 0) return 0;
      if (e.op === "^" && e.right === 0) return 1;
    }
    return e;
  },
  Subscript(e) {
    e.array = optimize(e.array);
    e.index = optimize(e.index);
    return e;
  },
  ArrayExpression(e) {
    e.elements = e.elements.map(optimize);
    return e;
  },
  MemberExpression(e) {
    e.object = optimize(e.object);
    return e;
  },
  CallStmt(e) {
    e.call = optimize(e.call);
    return e;
  },
  FuncCall(e) {
    e.name = optimize(e.name);
    e.args = e.args.map(optimize);
    return e;
  }
}

