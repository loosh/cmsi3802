import * as core from './core.js';
import util from 'util';

class Context {
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
    // console.log(
    //   `Looking for ${name} in ${util.inspect(context, { depth: 15 })}`
    // );
    must(!context.lookup(name), `Identifier ${name} already declared`, at);
  }

  function mustHaveBeenFound(entity, name, at) {
    must(entity, `Identifier ${name} not declared`, at);
  }

  function mustBeInLoop(at) {
    must(context.inLoop, "Break can only appear in a loop", at);
  }

  function mustBeInAFunction(at) {
    must(context.function, "Return can only appear in a function", at);
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
        const intializer = expression.rep();
        const variable = new core.Variable(id.sourceString, intializer.type);
        context.add(id.sourceString, variable);
        return new core.VariableDeclaration(variable, intializer);
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
        func.paramCount = params.length;
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
        context = context.parent;
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
        const stepValue = step.children.length == 0 ? null : step.children.map(c => c.rep())[0];

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
      Statement_assign(variable, _eq, expression) {
        const source = expression.rep();
        const target = variable.rep();
        return new core.Assignment(target, source);
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
      Exp1_or(exp, _or, exps) {
        let left = exp.rep();
        for (let e of exps.children) {
          let right = e.rep();
          left = new core.BinaryExpression('|', left, right);
        }
        return left;
      },
      Exp1_and(exp, _or, exps) {
        let left = exp.rep();
        for (let e of exps.children) {
          let right = e.rep();
          left = new core.BinaryExpression('&', left, right);
        }
        return left;
      },
      Exp2_relational(left, op, right) {
        return new core.BinaryExpression(op.sourceString, left.rep(), right.rep());
      },
      Exp3_math_assign(left, op, right) {
        return new core.BinaryExpression(op.sourceString, left.rep(), right.rep());
      },
      Prefix_unary(op, exp) {
        return new core.UnaryExpression(op.sourceString, exp.rep());
      },
      Postfix_unary(exp, op) {
        return new core.UnaryExpression(op.sourceString, exp.rep());
      },
      Primary_call(exp, open, args, _close) {
        const exps = args.asIteration().children;
        const callee = exp.rep();

        const target = context.lookup(callee.name);

        must(target instanceof core.Func, `${callee.name} is not a function`, { at: open });

        const targetParamCount = target.paramCount;
        mustHaveCorrectArgumentCount(exps.length, targetParamCount, { at: open });

        return new core.FuncCall(callee, args.rep());
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
      Primary_member(exp, dot, id) {
        const object = exp.rep();
        return new core.MemberExpression(object, dot.sourceString, id.sourceString);
      },
      Primary_subscript(exp1, _open, exp2, _close) {
        const [array, index] = [exp1.rep(), exp2.rep()];
        return new core.Subscript(array, index);
      },
      Term_math(op, left, right) {
        return new core.BinaryExpression(op.sourceString, left.rep(), right.rep());
      },
      Factor_exponential(left, op, right) {
        return new core.BinaryExpression(op.sourceString, left.rep(), right.rep());
      },
      true(_) {
        return true;
      },

      false(_) {
        return false;
      },
      numlit(_main, _dot, _frac, _exp, _sign, _num) {
        return Number(this.sourceString);
      },
      stringlit(_left, _chars, _right) {
        return this.sourceString;
      },
      Primary_id(id) {
        const entity = context.lookup(id.sourceString);
        mustHaveBeenFound(entity, id.sourceString, { at: id });
        return entity;
      },
      EmptyListOf() {
        return [];
      },
      NonemptyListOf(first, _, rest) {
        return [first.rep(), ...rest.children.map(c => c.rep())];
      }
    });

  return builder(match).rep();
};