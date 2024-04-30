// The code generator exports a single function, generate(program), which
// accepts a program representation and returns the JavaScript translation
// as a string.

import { TryStmt, standardLibrary } from "./core.js";
import util from "util";

export default function generate(program) {
  // When generating code for statements, we'll accumulate the lines of
  // the target code here. When we finish generating, we'll join the lines
  // with newlines and return the result.
  const output = [];

  const standardFunctions = new Map([
    [standardLibrary.log.name, x => `console.log(${x})`],
    [standardLibrary.sin.name, x => `Math.sin(${x})`],
    [standardLibrary.cos.name, x => `Math.cos(${x})`],
    [standardLibrary.exp.name, x => `Math.exp(${x})`],
    [standardLibrary.ln.name, x => `Math.log(${x})`],
    [standardLibrary.hypot.name, ([x, y]) => `Math.hypot(${x},${y})`],
  ]);

  const targetName = (mapping => {
    return entity => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1);
      }
      return `${entity.name}_${mapping.get(entity)}`;
    };
  })(new Map());

  const opConversions = {
    '^': '**',
    '~': '!',
    '~=': '!=',
    '|': '||',
    '&': '&&',
    '_': '-'
  };

  console.log(util.inspect(program, { depth: 10 }));

  const gen = (node, isArgument = false) => {
    return generators?.[node?.constructor?.name]?.(node, isArgument) ?? node;
  };

  const generators = {
    // Key idea: when generating an expression, just return the JS string; when
    // generating a statement, write lines of translated JS to the output array.
    Program(p) {
      p.statements.forEach(gen);
    },
    VariableDeclaration(d) {
      // We don't care about const vs. let in the generated code! The analyzer has
      // already checked that we never updated a const, so let is always fine.
      output.push(`let ${gen(d.variable)} = ${gen(d.value)};`);
    },
    FunctionDeclaration(d) {
      output.push(`function ${gen(d.func.name)}(${d.params.map(gen).join(", ")}) {`);
      d.body.forEach(gen);
      output.push("}");
    },
    Variable(v) {
      if (v === standardLibrary.pi) return "Math.PI";
      return v.name;
    },
    Func(f) {
      return f.name;
    },
    Assignment(s) {
      output.push(`${gen(s.target)} = ${gen(s.source)};`);
    },
    BreakStmt(s) {
      output.push("break;");
    },
    ContinueStmt(s) {
      output.push("continue;");
    },
    ReturnStmt(s) {
      output.push(`return ${gen(s.source)};`);
    },
    ShortReturnStmt(s) {
      output.push("return;");
    },
    IfStmt(s) {
      output.push(`if (${gen(s.test)}) {`);
      s.consequent.forEach(gen);
      if (s.alternate?.constructor?.name?.endsWith?.("IfStmt")) {
        output.push("} else");
        gen(s.alternate);
      } else {
        output.push("} else {");
        s.alternate.forEach(gen);
        output.push("}");
      }
    },
    ShortIfStmt(s) {
      output.push(`if (${gen(s.test)}) {`);
      s.consequent.forEach(gen);
      output.push("}");
    },
    WhileStmt(s) {
      output.push(`while (${gen(s.test)}) {`);
      s.body.forEach(gen);
      output.push("}");
    },
    RepeatStmt(s) {
      // JS can only repeat n times if you give it a counter variable!
      const i = targetName({ name: "i" });
      output.push(`for (let ${i} = 0; ${i} < ${gen(s.count)}; ${i}++) {`);
      s.body.forEach(gen);
      output.push("}");
    },
    ForRangeStmt(s) {
      const i = s.variable.name;
      const step = s.step ? gen(s.step) : 1;
      output.push(`for (let ${i} = ${gen(s.low)}; ${i} < ${gen(s.high)}; ${i} += ${step}) {`);
      s.body.forEach(gen);
      output.push("}");
    },
    ForStmt(s) {
      output.push(`for (let ${gen(s.iterator)} of ${gen(s.collection)}) {`);
      s.body.forEach(gen);
      output.push("}");
    },
    TryStmt(s) {
      output.push("try {");
      s.body.forEach(gen);
      output.push(`} catch (${s.exceptParams.map(gen).join(', ')}) {`);
      s.exceptBody.forEach(gen);
      output.push("}");
    },
    ThrowStmt(s) {
      output.push(`throw ${gen(s.exp)};`);
    },
    ConditionalExpression(e) {
      return `((${gen(e.test)}) ? (${gen(e.consequent)}) : (${gen(e.alternate)}))`;
    },
    BinaryExpression(e) {
      return `(${gen(e.left)} ${opConversions[e.op] ?? e.op} ${gen(e.right)})`;
    },
    UnaryExpression(e) {
      const operand = gen(e.operand);
      if (e.op === "#") {
        return `${operand}.length`;
      }
      if (e.op == "++" || e.op == "--") {
        return output.push(`${operand}${e.op};`);
      }
      if (e.op == "F") {
        return `Array.from({ length: ${operand} }, (_, i) => i + 1).reduce((a, b) => a * b, 1)`;
      }
      return `${opConversions[e.op]}(${operand})`;
    },
    Subscript(e) {
      return `${gen(e.array)}[${gen(e.index)}]`;
    },
    ArrayExpression(e) {
      return `[${e.elements.map(gen).join(",")}]`;
    },
    DictExpression(e) {
      return `{${e.elements.map(gen).join(", ")}}`;
    },
    DictItem(e) {
      return `${gen(e.key)}: ${gen(e.value)}`;
    },
    MemberExpression(e) {
      const object = gen(e.object);
      const id = gen(e.id);
      const chain = e.chain;
      return `${object}${chain}${id}`;
    },
    CallStmt(c) {
      const call = c.call;
      output.push(`${gen(call)};`);
    },
    FuncCall(c) {
      const targetCode = standardFunctions.has(c.name)
        ? standardFunctions.get(c.name)(c.args.map(gen))
        : `${gen(c.name)}(${c.args.map(gen).join(", ")})`;

      return targetCode;
    }
  };

  gen(program);
  return output.join("\n");
}