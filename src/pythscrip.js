import * as fs from 'node:fs/promises';
import process from 'node:process';
import util from 'node:util';

import parse from './parser.js';
import analyze from './analyzer.js';
import optimize from './optimizer.js';
import generate from './generator.js';

if (process.argv.length !== 3) {
  console.log('Must have exactly one argument: the filename of the program to compile.');
} else {
  try {
    const buffer = await fs.readFile(process.argv[2]);

    const match = parse(buffer.toString());
    const rep = analyze(match);

    console.log(util.inspect(rep, { depth: 5, colors: true }));

    // add pipeline operator (print(1) |> buffer |> match |> rep to language)

    parse(buffer.toString());
    console.log('Syntax ok');


  } catch (e) {
    console.error(`\u001b[31m${e}\u001b[39m`);
  }
}