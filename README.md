# PythScrip
![PythScrip](https://github.com/loosh/pythscrip/assets/89878786/c208addd-c23c-4691-9069-08b66eafdde1)

PythScrip is a "mini"-golfing language that incoorperates syntax and features from both Python and Javascript to create an improved version of Pyth with advanced features such as functions, classes, repeating, and more. Pythscrip is inspired by the concise syntax of Pyth and also utilizes its compact math syntax

## Features

- Dynamic types
- Concise syntax
- Repeat blocks
- Closure support
- Efficient for/while loops
- Shortcuts for tedious tasks

## Examples

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

### Functions

#### Javascript

```
const addFive = (x) => { return x + 5; }
```

#### Pythscrip

```
f addFive(x) => r +x 5
```

---

### If Statements

#### Javascript

```
x = 5
if (x < 5) {
  console.log('x is less than 5')
} else if (x > 5) {
  console.log('x is greater than 5)
} else {
  console.log('x is equal to 5)
}
```

#### Pythscrip

```
?x < 5:
  log('x is less than 5')
!? x > 5:
  log('x is greater than 5')
!:
  log('x is equal to 5')
```

---

### Loops

#### Javascript

```
for (let i = 0; i < 10; i++) {
  console.log(i * 10)
}
```

#### Pythscrip

```
i in 1,10 =>
  log(i)
```

---

### Quick Repeat

#### Javascript

```

```

#### Pythscrip

```
*.5 {
  log('this will log 5 times')
}
```

---

### Getting Length of Array or String

#### Javascript

```
a = ["banana", "cherry", "apple"]
console.log(a.length)
```

#### Pythscrip

```
a = ["banana", "cherry", "apple"]
log(#a)
```

---

### Recursive GCD

#### Javascript

```
const gcd = (a,b) => {
  if (a ==b) {
    return a;
  } else if (a > b) {
    return gcd(a-b, b)
  } else {
    return gcd(a,b)
  }
}
```

#### Pythscrip

```
f gcd(a,b) =>
  ?a==b:
    r a
  !?a>b:
    r gcd(a-b,b)
  !
    r gcd(a,b)
```

---
