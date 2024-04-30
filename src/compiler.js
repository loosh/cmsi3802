import parse from './parser.js';
import analyze from './analyzer.js';
import optimize from './optimizer.js';
import generate from './generator.js';
import js_beautify from 'js-beautify';

export default function compile(source, outputType) {
  if (!['parsed', 'analyzed', 'optimized', 'js'].includes(outputType)) {
    throw new Error('Unknown output type');
  }
  const match = parse(source);
  if (outputType === 'parsed') return 'Syntax is ok';
  const analyzed = analyze(match);
  if (outputType === 'analyzed') return analyzed;
  const optimized = optimize(analyzed);
  if (outputType === 'optimized') return optimized;
  return js_beautify(generate(optimized), { indent_size: 2 });
}