import * as assert from 'assert';
import { compile } from '../src/pythscrip.js';

describe('Compiler', () => {
  it('should pass', () => {
    assert.equal(compile(), 'eventually this will be compiled');
  });

  it('should be true that true === true', () => {
    assert.equal(true, true);
  });
});