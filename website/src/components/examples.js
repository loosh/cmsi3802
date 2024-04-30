import { CodeBlock, irBlack } from 'react-code-blocks';
import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

const examples = [
  {
    pythscrip: `log('Hello world, beep boop')`,
    javascript: `console.log('Hello world, beep boop')`
  },
  {
    pythscrip: `f addFive(x) => r + x * 5 _2;
    
    `,
    javascript: `function addFive(x) {
    return (x + -10);
}`
  },
  {
    pythscrip: `f multiplyByTwo(a) => r * a 2;
log(5 |> multiplyByTwo |> multiplyByTwo) // 21
    
    `,
    javascript: `function multiplyByTwo(a) {
  return (a * 2);
}
console.log(multiplyByTwo(multiplyByTwo(5)));`
  },
  {
    pythscrip: `*.5: log('This will run 5 times')
    
    `,
    javascript: `for (let i_1 = 0; i_1 < 5; i_1++) {
    console.log('This will run 5 times');
};`
  },
  {
    pythscrip: `x = 5
?x < 5: log('x is less than 5');
!? x > 5: log('x is greater than 5');
!: log('x is equal to 5');




`,
    javascript: `let x = 5;
    if ((x < 5)) {
      console.log('x is less than 5');
    } else
    if ((x > 5)) {
      console.log('x is greater than 5');
    } else {
      console.log('x is equal to 5');
    }`,
  },
  {
    pythscrip: `f gcd(a,b) => ?b==0: r a; !: r gcd(b, % a b);;
// Concise one line functions




`,
    javascript: `function gcd(a, b) {
    if ((b == 0)) {
      return a;
    } else {
      return gcd(b, (a % b));
    }
}`
  },
  {
    pythscrip: `f factorial(n) =>
    ?n==0: r 1;
    !: r * n factorial(-n 1);;



`,
    javascript: `function factorial(n) {
    if ((n == 0)) {
      return 1;
    } else {
      return (n * factorial((n - 1)));
    }
}`
  },
  {
    pythscrip: `f fibonacci(n) =>
    ?n < 2: r n;
    !: r + fibonacci(-n 1) fibonacci(-n 2);;



`,
    javascript: `function fibonacci(n) {
    if ((n < 2)) {
      return n;
    } else {
      return (fibonacci((n - 1)) + fibonacci((n - 2)));
    }
}`
  },
  {
    pythscrip: `
s = 'hello'

i in 0,#s: log(s[i]);`,
    javascript: `let s = 'hello';
for (let i = 0; i < s.length; i += 1) {
  console.log(s[i]);
}`
  },
  {
    pythscrip: `a = ['banana', 'cherry', 'apple']
log(#a) 
log(a[0])`,
    javascript: `var a = ['banana', 'cherry', 'apple'];
console.log(a.length);
console.log(a[0]);`
  }
];

export default function Examples() {
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    console.log(showMore);
  }, [showMore]);

  return (
    <div className='flex flex-col gap-4 ml-auto mr-auto max-w-4xl w-11/12 items-start'>
      <div className='flex w-full justify-between'>
        <h1 className='text-2xl font-bold'>Pythscrip</h1>
        <h1 className='text-2xl font-bold'>Javascript</h1>
      </div>
      <ol className={`${showMore ? 'mask-none' : ''} flex w-full flex-col gap-3`}>
        {examples.slice(0, showMore ? examples.length : 5).map((example, index) =>
        (<div key={index} className='flex justify-between gap-x-3'>
          <div className='w-1/2 h-full'>
            <CodeBlock
              text={example.pythscrip}
              language='javascript'
              theme={irBlack}
            />
          </div>
          <div className='w-1/2 h-full'>
            <CodeBlock
              text={example.javascript}
              language='python'
              theme={irBlack}
            />
          </div>
        </div>))}
      </ol>
      <button className={`text-blue-500 ml-auto mr-auto ${showMore && 'py-4'}`} onClick={() => setShowMore(!showMore)}>
        {showMore ? (
          <div className='flex items-center gap-2'>Show Less <ChevronUpIcon className='w-4 h-4' /></div>
        ) : (
          <div className='flex items-center gap-2'>Show More <ChevronDownIcon className='w-4 h-4' /></div>
        )}
      </button>
    </div>
  );
};;