<img src="./docs/logo.png" width="100">

# Pythscrip

[Our Website](https://loosh.github.io/pythscrip/)

Pythscrip is a "mini"-golfing language that incorporates syntax and features from both Python and Javascript to create an improved version of Pyth with advanced features such as functions, pipelines, repeating, and more. Pythscrip is inspired by the conciseness of Pyth and utilizes its compact math syntax.

---

##### Authors: Lucian Prinz and Nicolas Ortiz

---

## Features

- Dynamic types
- Concise syntax
  - 'Single quotes for strings only'
- Pipeline (|>) operator
- Built in short-cuts
  - Length
  - Uppercase
  - Lowercase
  - Reverse
  - Random
- Repeat blocks
- Efficient for/while loops

---

## Static Errors and Checks

- No error on redeclaring a variable
- Two functions cannot be declared with the same name
- Parameter identifiers must be unique from already declared variables
- Break and continue statements can only appear in loops
- Return statements can only appear in functions
- Throw statements can appear anywhere
- All math checks are handled by the generated JavaScript and thus errors will be thrown at runtime
- Object member expressions and array subscripts are handled by the generated JavaScript

---

## Functionality

### Printing

#### Javascript

```
console.log('hello world');
```

#### Pythscrip

```
log('hello world')
```

---

### Negative Numbers

#### Javascript

```
let a = -5;
```

#### Pythscrip

```
b = _5 // same as pyth
```

---

### Functions

#### Javascript

```
function addFive(x) { return x + 5; }
```

#### Pythscrip

```
f addFive(x) => r +x 5;
```

---

### Built-In Shortcuts

#### Javascript

```
let h = 'hello';
console.log(h.split('').reverse().join(''));
console.log(h.toUpperCase());
console.log(h.toLowerCase());
let fruits = ['apple','banana','orange'];
console.log(fruits[Math.floor(Math.random() * fruits.length)]);
```

#### Pythscrip

```
h = 'hello'
log(rev(h))
log(up(h))
log(low(h))
fruits = ['apple', 'banana', 'orange']
log(rand(fruits))
```

---

### Pipeline Operator

### Javascript

```
let fruits = ['banana', 'apple', 'orange'];
console.log(fruits[Math.floor(Math.random() * fruits.length)].toUpperCase());
```

### Pythscrip

```
fruits = ['banana', 'apple', 'orange']
log(fruits |> rand |> up)
```

#### Javascript

```
function multiplyByTwo(a) { return (a \* 2); }

function addOne(b) { return (b + 1); }

console.log(addOne(multiplyByTwo(multiplyByTwo(5)))); // 21
```

#### Pythscrip

```
f multiplyByTwo(a) => r \*a 2; f addOne(b) => r + b 1;

log(5 |> multiplyByTwo |> multiplyByTwo |> addOne) // 21
```

### Logic Statements

#### If Statements

##### Javascript

```
let x = 5;
if (x < 5) {
  console.log('x is less than 5');
} else if (x > 5) {
  console.log('x is greater than 5');
} else {
  console.log('x is equal to 5');
}
```

##### Pythscrip

```
x = 5 
?x < 5: log('x is less than 5'); 
!? x > 5: log('x is greater than 5'); 
!: log('x is equal to 5');
```

#### Ternary Statements

##### Javascript

```
height > 6 ? true : false;
```

##### Pythscrip

```
true ? height > 6 ! false
```

---

### Try Catch/Except

#### Javascript

```
try { 
  if (height < 6) throw "Too Short"; 
} catch(error) { 
  console.log(error); 
}
```

#### Pythscrip

```
t: ?height < 6: th 'Too Short';; 
e(error): log(error);
```

---

### Loops

#### For Loop

##### Javascript

```
for (let i = 0; i < 10; i += 1) { 
  console.log(i \* 10); 
}

var s = "hello"
for (let i = 0; i < s.length(); i += 1) { 
  console.log(s[i]); 
}
```

##### Pythscrip

```
i in 1,10: log(\*i 10);

s = 'hello' i in 0,#s: log(s[i]);
```

#### While Loop

##### Javascript

```
let i = -10;
while (i <= 10) {
  if (i == 5) continue;
  if (i == 3) break;
  console.log(i);
  i += 1 ;
}
```

##### Pythscrip

```
i = _10 
w i<= 10: 
  ?i==5: ct; 
  ?i==3: br;
  log(i) 
  i += 1;
```

---

### Quick Repeat

#### Javascript

```
// Would have to use a loop with a defined variable
for (let i_1 = 0; i_1 < 5; i_1++) {
  console.log('This will log 5 times');
};
```

#### Pythscrip

```
\*.5: log('This will log 5 times');
```

---

## More Examples

### Getting Length of Array or String

#### Javascript

```
a = ['banana', 'cherry', 'apple'];
console.log(a.length);
console.log(a[0]);
```

#### Pythscrip

```
a = ['banana', 'cherry', 'apple']
log(#a)
log(a[0])
```

---

### Recursive GCD

#### Javascript

```
function gcd(a, b) {
  if ((b == 0)) {
    return a;
  } else {
    return gcd(b, (a % b));
  }
}
```

#### Pythscrip

```
f gcd(a,b) =>
  ?b==0: r a;
  !: r gcd(b, %a b);;
```

Or, if you would like it in one line

```
f gcd(a,b) => ?b==0: r a; !: r gcd(b, % a b);;
```

