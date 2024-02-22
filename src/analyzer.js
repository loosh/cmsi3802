import * as core from './core.js';

export default function analyze(match) {

  const analyzer = match.matcher.grammar
    .createSemantics()
    .addOperation('rep', {
      Program(statements) {
        return new core.Program(statements.children.map(s => s.rep()));
      },
      Assignment(id, _eq, expression) {
        return new core.Assignment(id.sourceString, expression.rep());
      },
      PrintStmt(_log, _open, exp, _close) {
        return new core.PrintStmt(exp.rep());
      },
      Function(_f, id, _open, params, _close, _arrow, statements, _semi) {
        return new core.Function(id.sourceString, params.rep(), statements.children.map(s => s.rep()));
      },
      FuncCall(id, _open, params, _close) {
        console.log(params.children);
        return new core.FuncCall(id.sourceString, params.rep());
      },
      IfStmt_with_else(_q, condition, b1, _e, _b2) {
        return new core.IfStmt(condition.rep(), b1.rep(), b2.rep());
      },
      IfStmt_nested_if(_q, condition, b1, _e, b2) {
        return new core.IfStmt(condition.rep(), b1.rep(), b2.rep());
      },
      IfStmt_plain_if(_q, condition, b1) {
        return new core.IfStmt(condition.rep(), b1.rep());
      },
      IfStmt_with_else(_q, condition, b1, _e, b2) {
        return new core.IfStmt(condition.rep(), b1.rep(), b2.rep());
      },
      LoopIfStmt_nested_if(_q, condition, b1, _e, b2) {
        return new core.IfStmt(condition.rep(), b1.rep(), b2.rep());
      },
      LoopIfStmt_plain_if(_q, condition, b1) {
        return new core.IfStmt(condition.rep(), b1.rep());
      },
      ForStmt_range(id, _in, start, _comma, end, _step, step, block) {
        let stepValue = step.children.length > 0 ? step.rep() : 1;
        return new core.ForStmt(id.sourceString, start.rep(), end.rep(), stepValue, block.rep());
      },
      ForStmt_direct(id, _in, exp, block) {
        return new core.ForStmt(id.sourceString, exp.rep(), null, null, block.rep());
      },
      WhileStmt(_while, exp, block) {
        return new core.WhileStmt(exp.rep(), block.rep());
      },
      RepeatStmt(_star, _dot, count, block) {
        const repeatCount = parseInt(count.children.map(c => c.sourceString).join(''), 10);
        return new core.RepeatStmt(repeatCount, block.rep());
      },
      Block(_open, statements, _close) {
        return new core.Block(statements.children.map(s => s.rep()));
      },
      LoopBlock(_open, statements, _close) {
        return new core.Block(statements.children.map(s => s.rep()));
      },
      BreakStmt(_break) {
        return new core.BreakStmt();
      },
      ContinueStmt(_continue) {
        return new core.ContinueStmt();
      },
      ReturnStmt(_return, exp) {
        return new core.ReturnStmt(exp.rep());
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
      Primary_array(_open, elements, _close) {
        return new core.ArrayExpression(elements.rep());
      },
      Primary_get_object_dot(id, _dot, prop) {
        return new core.AccessExpression(id.sourceString, prop.sourceString);
      },
      Primary_get_bracket(id, _open, index, _close) {
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

  return analyzer(match).rep();
};