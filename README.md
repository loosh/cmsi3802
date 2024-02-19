# Pythscrip

![logo](/docs/logo.png)

Pythscrip is a "mini"-golfing language that incorporates syntax and features from both Python and Javascript to create an improved version of Pyth with advanced features such as functions, classes, repeating, and more. Pythscrip is inspired by the concise syntax of Pyth and also utilizes its compact math syntax

---

##### Authors: Lucian Prinz and Nicolas Ortiz

---

## Features

- Dynamic types
- Concise syntax
  - 'Single quotes for strings only'
- Repeat blocks
- Closure support
- Efficient for/while loops
- Shortcuts for tedious tasks

## Functionality

### Printing

#### Javascript

```
console.log("hello world")
```

#### Pythscrip

```
log('hello world')
```

---

### Negative Numbers

#### Javascript

```
a = -5
```

#### Pythscrip

```
b = _5 // same as pyth
```

---

### Functions

#### Javascript

```
const addFive = (x) => { return x + 5; }
```

#### Pythscrip

```
f addFive(x) => r +x 5;
```

---

### Logic Statements

#### If Statements

##### Javascript

```
x = 5
if (x < 5) {
  console.log("x is less than 5");
} else if (x > 5) {
  console.log("x is greater than 5");
} else {
  console.log("x is equal to 5");
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
height > 6 ? true : false
```

##### Pythscrip

```
true ? height > 6 ! false
```

---

### Try Catch/Except

#### Javascript

```
try{
  if(height < 6) throw "Too Short"
}
catch(error) {
  console.log(error)
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
for (let i = 0; i < 10; i++) {
  console.log(i * 10)
}

var s = "hello"
for (let i = 0; i < s.length(); i++) {
  console.log(s[i])
}
```

##### Pythscrip

```
i in 1,10:
  log(*i 10);

s = 'hello'
i in 0,#s: log(s[i]);
```

#### While Loop

##### Javascript

```
var i = -10
while (i <= 10) {
  if (i == 5) continue
  if (i == 3) break
  console.log(i)
  i += 1
}
```

##### Pythscrip

```
i = _10
w i<=10:
  ?i==5: ct;
  ?i==3: br;
  log(i)
  i += 1
;
```

---

### Quick Repeat

#### Javascript

```

```

#### Pythscrip

```
*.5:
  log('this will log 5 times');
```

---

## Examples

### Getting Length of Array or String

#### Javascript

```
a = ["banana", "cherry", "apple"]
console.log(a.length)
console.log(a[0])
```

#### Pythscrip

```
a = ['banana', 'cherry', 'apple']
log(#a)   //prints 3
log(a[0]) //prints banana
```

---

### Recursive GCD

#### Javascript

```
const gcd = (a,b) => {
  if (a ==b) {
    return a;
  } else if (a > b) {
    return gcd(a-b, b);
  } else {
    return gcd(a,b);
  }
}
```

#### Pythscrip

```
f gcd(a,b) =>
  ?a==b: r a;
  !?a>b: r gcd(-a b,b);
  !: r gcd(a,b);
  ;
```

Or, if you would like it in one line

```
fgcd(a,b)=>?a==b:ra;!?a>b:rgcd(-a b,b);!:rgcd(a,b);;
```

