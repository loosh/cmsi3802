import * as fs from 'node:fs/promises';
import process from 'node:process';

import compile from './compiler.js';
import util from 'node:util';

const help = `Pythscrip compiler

Syntax: pythscrip <filename> <outputType>

Prints to stdout according to <outputType>, which must be one of:

  parsed     a message that the program was matched ok by the grammar
  analyzed   the statically analyzed representation
  optimized  the optimized semantically analyzed representation
  js         the translation to JavaScript
`;

async function compileFromFile(filename, outputType) {
  try {
    const buffer = await fs.readFile(filename);
    const compiled = compile(buffer.toString(), outputType);
    console.log(['analyzed', 'optimized'].includes(outputType) ? util.inspect(compiled, { depth: null }) : compiled);
  } catch (e) {
    console.error(`\u001b[31m${e}\u001b[39m`);
    process.exitCode = 1;
  }
}

if (process.argv.length !== 4) {
  console.log(help);
} else {
  compileFromFile(process.argv[2], process.argv[3]);
}