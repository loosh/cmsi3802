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
      IfStmt_with_else(_q, condition, _b1, _e, _b2) {
        return new core.IfStatement(condition.rep(), _b1.rep(), _b2.rep());
      },
      IfStmt_nested_if(_q, condition, _b1, _e, _b2) {
        return new core.IfStatement(condition.rep(), _b1.rep(), _b2.rep());
      },
      IfStmt_plain_if(_q, condition, _b1) {
        return new core.IfStatement(condition.rep(), _b1.rep());
      },
      WhileStmt(_while, exp, block) {
        return new core.WhileStatement(exp.rep(), block.rep());
      },
      RepeatStmt(_star, _dot, count, block) {
        const repeatCount = parseInt(count.children.map(c => c.sourceString).join(''), 10);
        return new core.RepeatStmt(repeatCount, block.rep());
      },
      Block(_open, statements, _close) {
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
      Exp2_relational(left, op, right) {
        return new core.RelationalExpression(op.sourceString, left.rep(), right.rep());
      },
      Term_binary(op, left, right) {
        return new core.BinaryExpression(op.sourceString, left.rep(), right.rep());
      },
      numlit(_main, _dot, _frac, _exp, _sign, _num) {
        return new core.Number(this.sourceString);
      },
      stringlit(_left, _chars, _right) {
        return new core.String(this.sourceString);
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