# Browser Rendering Pipeline & Event Propagation

A comprehensive guide to understanding how browsers render web pages, process HTML/CSS/JavaScript, and handle events.

---

# Table of Contents

* Browser Rendering Pipeline
* HTML Processing

  * Tokenization
  * Parsing
  * DOM Tree
* CSS Processing

  * Tokenization
  * Parsing
  * CSSOM Tree
* Render Tree Creation
* Layout (Reflow)
* Paint
* Compositing
* JavaScript Processing

  * Tokenization
  * Parsing
  * AST
  * Execution
* DOM Updates & Re-rendering
* Event Propagation

  * Event Capturing
  * Target Phase
  * Event Bubbling
  * stopPropagation()
* Event Delegation

  * Without Event Delegation
  * With Event Delegation
  * Benefits

---

# Browser Rendering Pipeline

```text
HTML
 │
 ▼
Tokenization
 │
 ▼
Parsing
 │
 ▼
DOM Tree
 │
 │
 ├─────────────────────────────┐
 │                             │
 ▼                             ▼
CSS                     JavaScript
 │                             │
 ▼                             ▼
Tokenization            Tokenization
 │                             │
 ▼                             ▼
Parsing                 Parsing
 │                             │
 ▼                             ▼
CSSOM Tree                  AST
 │                             │
 └──────────────┬──────────────┘
                │
                ▼
           Render Tree
                │
                ▼
         Layout (Reflow)
                │
                ▼
              Paint
                │
                ▼
           Compositing
                │
                ▼
        Pixels on Screen
```

---

# HTML Processing

## 1. HTML Download

The browser first downloads the HTML document from the server.

Example:

```html
<body>
  <h1>Hello</h1>
  <p>Welcome</p>
</body>
```

---

## 2. HTML Tokenization

The browser converts raw HTML text into tokens.

Example Tokens:

```text
START_TAG(body)
START_TAG(h1)
TEXT(Hello)
END_TAG(h1)
START_TAG(p)
TEXT(Welcome)
END_TAG(p)
END_TAG(body)
```

---

## 3. HTML Parsing

The parser uses these tokens to construct the DOM Tree.

```text
body
├── h1
│   └── "Hello"
└── p
    └── "Welcome"
```

The DOM (Document Object Model) is a tree-like representation of the HTML document.

---

# CSS Processing

## CSS Download

The browser loads external and internal stylesheets.

Example:

```css
h1 {
  color: blue;
}

p {
  color: gray;
}
```

---

## CSS Tokenization

The CSS source code is broken into tokens.

```text
IDENT(h1)
{
PROPERTY(color)
VALUE(blue)
}
```

---

## CSS Parsing

The parser creates the CSSOM (CSS Object Model).

```text
Stylesheet
├── h1 → color: blue
└── p → color: gray
```

---

# Render Tree Creation

The browser combines:

```text
DOM + CSSOM
```

to create the Render Tree.

Example:

```text
body
├── h1 (blue)
└── p (gray)
```

### Important

Elements with:

```css
display: none;
```

are excluded from the Render Tree.

---

# Layout (Reflow)

The browser calculates:

* Position
* Width
* Height
* Margins
* Padding

for every visible element.

Example:

```text
h1
x: 0
y: 0
width: 500
height: 50

p
x: 0
y: 60
width: 500
height: 20
```

---

# Paint

The browser converts layout information into drawing instructions.

Example:

```text
Draw background
Draw text
Draw borders
Draw images
```

At this stage, the browser knows what to draw but has not yet displayed it on the screen.

---

# Compositing

The browser separates content into layers.

Example:

```text
Layer 1: Background
Layer 2: Text
Layer 3: Animated Card
```

The GPU combines them:

```text
Layer 1
+
Layer 2
+
Layer 3
=
Final Screen
```

The final pixels are then displayed on the screen.

---

# JavaScript Processing

When the browser encounters:

```html
<script src="app.js"></script>
```

it performs the following steps:

1. Downloads the JavaScript file
2. Tokenizes the code
3. Parses the tokens
4. Creates an AST
5. Compiles/Interprets
6. Executes

---

## JavaScript Pipeline

```text
JavaScript Source
       │
       ▼
 Tokenization
       │
       ▼
    Parsing
       │
       ▼
      AST
       │
       ▼
   Execution
```

---

## AST (Abstract Syntax Tree)

Example:

```js
let x = 10;
```

AST:

```text
VariableDeclaration
└── Identifier(x)
└── Literal(10)
```

The JavaScript engine uses the AST to understand and execute code.

---

# DOM Updates & Re-rendering

When JavaScript modifies the DOM:

```js
document.querySelector("h1").textContent = "Hi";
```

the browser may need to:

```text
DOM Update
     │
     ▼
Render Tree Update
     │
     ▼
Layout
     │
     ▼
Paint
     │
     ▼
Composite
```

This process updates the UI.

---

# Event Propagation

Event propagation describes how events travel through the DOM.

It consists of three phases:

1. Capturing Phase
2. Target Phase
3. Bubbling Phase

---

# Event Capturing

The event travels from the root element down to the target.

```text
document
   ↓
html
   ↓
body
   ↓
grandparent
   ↓
parent
   ↓
button
```

Example:

```js
grandparent.addEventListener(
  "click",
  () => {
    console.log("Grandparent Capture");
  },
  true
);

parent.addEventListener(
  "click",
  () => {
    console.log("Parent Capture");
  },
  true
);

button.addEventListener(
  "click",
  () => {
    console.log("Button Capture");
  },
  true
);
```

Output:

```text
Grandparent Capture
Parent Capture
Button Capture
```

---

# Target Phase

The event reaches the element that triggered it.

```text
button ← target
```

Handlers attached to the target element execute here.

---

# Event Bubbling

The event travels upward after reaching the target.

```text
button
  ↑
parent
  ↑
grandparent
  ↑
body
  ↑
html
  ↑
document
```

Example:

```js
grandparent.addEventListener("click", () => {
  console.log("Grandparent Bubble");
});

parent.addEventListener("click", () => {
  console.log("Parent Bubble");
});

button.addEventListener("click", () => {
  console.log("Button Bubble");
});
```

Output:

```text
Button Bubble
Parent Bubble
Grandparent Bubble
```

---

# Complete Event Flow

```js
grandparent.addEventListener(
  "click",
  () => {
    console.log("Grandparent Capture");
  },
  true
);

parent.addEventListener(
  "click",
  () => {
    console.log("Parent Capture");
  },
  true
);

button.addEventListener("click", () => {
  console.log("Button");
});

parent.addEventListener("click", () => {
  console.log("Parent Bubble");
});

grandparent.addEventListener("click", () => {
  console.log("Grandparent Bubble");
});
```

Output:

```text
Grandparent Capture
Parent Capture
Button
Parent Bubble
Grandparent Bubble
```

---

# stopPropagation()

Stops the event from moving further.

```js
button.addEventListener("click", (e) => {
  e.stopPropagation();
});
```

Now parent and grandparent listeners will not execute during bubbling.

---

# Event Delegation

Event Delegation is a technique where a single event listener is attached to a parent element instead of multiple child elements.

It works because of event bubbling.

---

# Without Event Delegation

```html
<button>Button 1</button>
<button>Button 2</button>
<button>Button 3</button>
```

```js
const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    console.log(button.textContent);
  });
});
```

### Problems

* Multiple listeners
* More memory consumption
* Harder maintenance

---

# With Event Delegation

```html
<div id="container">
  <button>Button 1</button>
  <button>Button 2</button>
  <button>Button 3</button>
</div>
```

```js
const container = document.getElementById("container");

container.addEventListener("click", (event) => {
  console.log(event.target.textContent);
});
```

Output:

```text
Button 1
```

or

```text
Button 2
```

or

```text
Button 3
```

---

# How Event Delegation Works

When Button 2 is clicked:

```text
Button 2
   ↑
Container
```

The event bubbles up to the parent.

The parent listener catches the event.

---

## event.target

The key concept behind event delegation is:

```js
event.target
```

It refers to the element that originally triggered the event.

Example:

```js
container.addEventListener("click", (event) => {
  console.log(event.target);
});
```

Output:

```html
<button>Button 1</button>
```

---

# Advantages of Event Delegation

## 1. Better Performance

Instead of:

```text
1000 listeners
```

Use:

```text
1 listener
```

---

## 2. Less Memory Usage

Only one callback function is stored.

---

## 3. Handles Dynamic Elements

Newly added child elements automatically work without adding new listeners.

---

## 4. Cleaner Code

Event handling logic remains centralized and easier to maintain.

---

# Summary

```text
HTML
  ↓
Tokenization
  ↓
Parsing
  ↓
DOM

CSS
  ↓
Tokenization
  ↓
Parsing
  ↓
CSSOM

DOM + CSSOM
      ↓
 Render Tree
      ↓
   Layout
      ↓
    Paint
      ↓
 Composite
      ↓
 Screen

JavaScript
      ↓
 Tokenization
      ↓
   Parsing
      ↓
     AST
      ↓
 Execution

DOM Changes
      ↓
Render Tree Update
      ↓
 Layout
      ↓
 Paint
      ↓
Composite

Events
Capture → Target → Bubble

Event Delegation
= One Parent Listener
= Better Performance
= Less Memory Usage
= Dynamic Element Support
```
