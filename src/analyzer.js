import * as core from './core.js';

const INT = core.intType;
const FLOAT = core.floatType;
const STRING = core.stringType;
const BOOLEAN = core.boolType;
const ANY = core.anyType;
const VOID = core.voidType;

class Context {
  // Like most statically-scoped languages, Carlos contexts will contain a
  // map for their locally declared identifiers and a reference to the parent
  // context. The parent of the global context is null. In addition, the
  // context records whether analysis is current within a loop (so we can
  // properly check break statements), and reference to the current function
  // (so we can properly check return statements).
  constructor({ parent = null, locals = new Map(), inLoop = false, function: f = null }) {
    Object.assign(this, { parent, locals, inLoop, function: f });
  }
  add(name, entity) {
    this.locals.set(name, entity);
  }
  lookup(name) {
    return this.locals.get(name) || this.parent?.lookup(name);
  }
  static root() {
    return new Context({ locals: new Map(Object.entries(core.standardLibrary)) });
  }
  newChildContext(props) {
    return new Context({ ...this, ...props, parent: this, locals: new Map() });
  }
}

export default function analyze(match) {
  let context = Context.root();

  function must(condition, message, errorLocation) {
    if (!condition) {
      const prefix = errorLocation.at.source.getLineAndColumnMessage();
      throw new Error(`${prefix}${message}`);
    }
  }

  function mustNotAlreadyBeDeclared(name, at) {
    must(!context.lookup(name), `Identifier ${name} already declared`, at);
  }

  function mustBeInLoop(at) {
    must(context.inLoop, "Break can only appear in a loop", at);
  }

  function mustBeInAFunction(at) {
    must(context.function, "Return can only appear in a function", at);
  }

  function mustBeCallable(e, at) {
    const callable = e?.kind === "StructType" || e.type?.kind === "FunctionType";
    must(callable, "Call of non-function or non-constructor", at);
  }

  function mustHaveCorrectArgumentCount(argCount, paramCount, at) {
    const message = `${paramCount} argument(s) required but ${argCount} passed`;
    must(argCount === paramCount, message, at);
  }

  const builder = match.matcher.grammar
    .createSemantics()
    .addOperation('rep', {
      Program(statements) {
        return new core.Program(statements.children.map(s => s.rep()));
      },
      VarDecl(id, _eq, expression) {
        const value = expression.rep();
        const variable = new core.Variable(id.sourceString);
        mustNotAlreadyBeDeclared(id.sourceString, { at: id });
        context.add(id.sourceString, variable);
        return new core.VariableDeclaration(variable, value);
      },
      PrintStmt(_log, _open, exp, _close) {
        return new core.PrintStmt(exp.rep());
      },
      FuncDecl(_f, id, parameters, _arrow, statements, _semi) {
        const func = new core.Func(id.sourceString);
        mustNotAlreadyBeDeclared(id.sourceString, { at: id });
        context.add(id.sourceString, func);

        context = context.newChildContext({ inLoop: false, function: func });
        const params = parameters.rep();
        const body = statements.children.map(s => s.rep());

        context = context.parent;
        return new core.FunctionDeclaration(func, params, body);
      },
      Params(_open, params, _close) {
        return params.asIteration().children.map(p => p.rep());
      },
      Param(id) {
        const param = new core.Variable(id.sourceString);
        mustNotAlreadyBeDeclared(param.name, { at: id });
        context.add(param.name, param);
        return param;
      },
      IfStmt_with_else(_q, condition, b1, _e, b2) {
        const test = condition.rep();
        context = context.newChildContext();
        const consequent = b1.rep();
        context = context.parent;
        context = context.newChildContext();
        const alternate = b2.rep();
        context = context.parent;
        return new core.IfStmt(test, consequent, alternate);
      },
      IfStmt_nested_if(_q, condition, b1, _e, b2) {
        const test = condition.rep();
        context = context.newChildContext();
        const consequent = b1.rep();
        const alternate = b2.rep();
        return new core.IfStmt(test, consequent, alternate);
      },
      IfStmt_plain_if(_q, condition, b1) {
        const test = condition.rep();
        context = context.newChildContext();
        const consequent = b1.rep();
        context = context.parent;
        return new core.ShortIfStmt(test, consequent);
      },
      LoopStmt_while(_while, exp, block) {
        const test = exp.rep();
        context = context.newChildContext({ inLoop: true });
        const body = block.rep();
        context = context.parent;
        return new core.WhileStmt(test, body);
      },
      LoopStmt_repeat(_star, _dot, count, block) {
        const repeatCount = parseInt(count.children.map(c => c.sourceString).join(''), 10);
        return new core.RepeatStmt(repeatCount, block.rep());
      },
      LoopStmt_range(id, _in, exp1, _comma, exp2, _comma2, step, block) {
        const [start, end] = [exp1.rep(), exp2.rep()];

        const iterator = new core.Variable(id.sourceString);
        context = context.newChildContext({ inLoop: true });
        context.add(id.sourceString, iterator);

        const body = block.rep();
        const stepValue = step.children.length === 0 ? null : step.rep();

        context = context.parent;
        return new core.ForRangeStmt(iterator, start, end, stepValue, body);
      },
      LoopStmt_direct(id, _in, exp, block) {
        const collection = exp.rep();
        const iterator = new core.Variable(id.sourceString);
        context = context.newChildContext({ inLoop: true });
        context.add(iterator.name, iterator);
        const body = block.rep();
        context = context.parent;
        return new core.ForStmt(iterator, collection, body);
      },
      Block(_open, statements, _close) {
        return statements.children.map(s => s.rep());
      },
      Statement_break(breakKeyword) {
        mustBeInLoop({ at: breakKeyword });
        return new core.BreakStmt();
      },
      Statement_continue(continueKeyword) {
        mustBeInLoop({ at: continueKeyword });
        return new core.ContinueStmt();
      },
      TryStmt(_try, block, _except, params, exceptBlock) {
        context = context.newChildContext();
        const body = block.rep();
        context = context.parent;
        const exceptParams = params.rep();
        context = context.newChildContext();
        const exceptBody = exceptBlock.rep();
        context = context.parent;
        return new core.TryStmt(body, exceptParams, exceptBody);
      },
      Statement_throw(_throw, exp) {
        return new core.ThrowStmt(exp.rep());
      },
      Statement_return(returnKeyword, exp) {
        mustBeInAFunction({ at: returnKeyword });
        const returnExpression = exp.rep();
        return new core.ReturnStmt(returnExpression);
      },
      Statement_shortreturn(returnKeyword) {
        mustBeInAFunction({ at: returnKeyword });
        return new core.ShortReturnStatement();
      },
      Exp_conditional(consequent, _q, test, _e, alternate) {
        return new core.ConditionalExpression(test.rep(), consequent.rep(), alternate.rep());
      },
      Exp1_or(left, _or, right) {
        return new core.LogicalExpression('or', left.rep(), right.rep());
      },
      Exp1_and(left, _and, right) {
        return new core.LogicalExpression('and', left.rep(), right.rep());
      },
      Exp2_relational(left, op, right) {
        return new core.RelationalExpression(op.sourceString, left.rep(), right.rep());
      },
      Exp3_math_assign(left, op, right) {
        return new core.MathAssignmentExpression(op.sourceString, left.rep(), right.rep());
      },
      Prefix_unary(op, exp) {
        return new core.UnaryExpression(op.sourceString, exp.rep());
      },
      Postfix_unary(exp, op) {
        return new core.UnaryExpression(op.sourceString, exp.rep());
      },
      Primary_call(id, _open, args, _close) {
        return new core.FuncCall(id.sourceString, args.rep());
      },
      Primary_array(_open, elements, _close) {
        return new core.ArrayExpression(elements.rep());
      },
      Primary_dict(_open, elements, _close) {
        return new core.DictExpression(elements.rep());
      },
      DictItem(id, _colon, exp) {
        return new core.DictItem(id.sourceString, exp.rep());
      },
      Primary_member(id, _dot, prop) {
        return new core.AccessExpression(id.sourceString, prop.sourceString);
      },
      Primary_subscript(id, _open, index, _close) {
        return new core.AccessExpression(id.sourceString, index.rep());
      },
      Term_binary(op, left, right) {
        return new core.BinaryExpression(op.sourceString, left.rep(), right.rep());
      },
      numlit(_main, _dot, _frac, _exp, _sign, _num) {
        return new core.Number(this.sourceString);
      },
      stringlit(_left, chars, _right) {
        return new core.String(chars.children.map(c => c.sourceString).join(''));
      },
      id(_letter, _id) {
        return new core.Variable(this.sourceString);
      },
      NonemptyListOf(first, _, rest) {
        return [first.rep(), ...rest.children.map(c => c.rep())];
      }
    });

  return builder(match).rep();
};