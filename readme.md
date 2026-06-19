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

----------------*****----------------


                -----HTML-----

HTML- Browser downloads HTML document.

HTML Tokenization - The browser converts the raw text into tokens:
                    START_TAG(body)
                    START_TAG(h1)
                    TEXT(Hello)
                    END_TAG(h1)
                    START_TAG(p)
                    TEXT(Welcome)
                    END_TAG(p)
                    END_TAG(body)

HTML Parsing - The parser uses these tokens to build the DOM:
                body
                ├── h1
                │   └── "Hello"
                └── p
                    └── "Welcome"





         -----------CSS Processing-----------

CSS - Browser loads stylesheets.
        h1 {
        color: blue;
        }

        p {
        color: gray;
        }


CSS Tokenization - Converts CSS text into selectors, properties and values.
                    IDENT(h1)
                    {
                    PROPERTY(color)
                    VALUE(blue)
                    }


CSS Parsing - Creates a structured stylesheet model.
                Stylesheet
                ├── h1 → color: blue
                └── p → color: gray



              ----------Render Tree Creation----------

The browser combines: DOM + CSSOM

TO Create: body
            ├── h1 (blue)
            └── p (gray)

This is called the Render Tree.

Elements with display: none; are excluded.

Layout (Reflow): The browser calculates the size and position of each visible element.
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


Paint: The browser converts layout information into drawing instructions.
        Draw yellow background
        Draw blue text
        Draw border
        Draw image

Nothing is displayed yet; the browser is preparing pixels.

Compositing: The browser organizes content into layers.
                Layer 1: Background
                Layer 2: Text
                Layer 3: Animated Card

The GPU combines these layers:  Layer 1
                                +
                                Layer 2
                                +
                                Layer 3
                                =
                                Final Screen


             ---------------Where JavaScript Fits------------------

When the browser encounters:  <script src="app.js"></script>


it:

1. Downloads the script
2. Tokenizes the JavaScript
3. Parses it into an AST (Abstract Syntax Tree)
4. Compiles/interprets it
5. Executes it


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


 If JavaScript modifies the DOM:  document.querySelector("h1").textContent = "Hi";


 the browser may need to:   DOM Update
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
                            
                            


                            ------------Event Capturing & Event Bubbling---------------

Event Capturing and Event Bubbling are phases of event propagation.


1. Event Capturing (Top → Down)

Also called the capture phase.

The event starts from the root and moves downward toward the target element.

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

Example: 

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

child.addEventListener(
  "click",
  () => {
    console.log("Button Capture");
  },
  true
);


Clicking the button prints:

Grandparent Capture
Parent Capture
Button Capture

The event is traveling downward.



2. Target Phase

The event reaches the actual element that triggered it.

button ← target

At this point, handlers on the button can execute.


3. Event Bubbling (Bottom → Up)

After reaching the target, the event travels back up.

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

This is the default behavior in JavaScript.

Example:

grandparent.addEventListener("click", () => {
  console.log("Grandparent Bubble");
});

parent.addEventListener("click", () => {
  console.log("Parent Bubble");
});

child.addEventListener("click", () => {
  console.log("Button Bubble");
});

Output:

Button Bubble
Parent Bubble
Grandparent Bubble

The event is traveling upward.

Complete Flow:

Suppose all listeners are attached:

grandparent.addEventListener("click", () => {
  console.log("Grandparent Capture");
}, true);

parent.addEventListener("click", () => {
  console.log("Parent Capture");
}, true);

child.addEventListener("click", () => {
  console.log("Button");
});

parent.addEventListener("click", () => {
  console.log("Parent Bubble");
});

grandparent.addEventListener("click", () => {
  console.log("Grandparent Bubble");
});

Output:

Grandparent Capture
Parent Capture
Button
Parent Bubble
Grandparent Bubble


stopPropagation()

Stops the event from moving further.

child.addEventListener("click", (e) => {
  e.stopPropagation();
});

Now parent and grandparent handlers won't execute during bubbling.






                         ------------------Event Delegation-----------------

Event Delegation is a technique where you attach a single event listener to a parent element instead of attaching listeners to multiple child elements.

It works because of event bubbling.



----------Without Event Delegation----------------

Suppose you have 100 buttons:

<button>Button 1</button>
<button>Button 2</button>
<button>Button 3</button>
...
<button>Button 100</button>

You might write:

const buttons = document.querySelectorAll("button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    console.log(button.textContent);
  });
});

Problem:
100 event listeners
More memory usage
More setup work



----------With Event Delegation----------

Wrap the buttons in a parent:

<div id="container">
  <button>Button 1</button>
  <button>Button 2</button>
  <button>Button 3</button>
</div>

Attach a single listener to the parent:

const container = document.getElementById("container");

container.addEventListener("click", (event) => {
  console.log(event.target.textContent);
});

Now clicking any button prints:

Button 1

or

Button 2

or

Button 3


-------How It Works----------

When Button 2 is clicked:

Button 2
    ↑
Container

The click event first occurs on the button and then bubbles up to the parent container.

The parent's listener catches it.

event.target

The key to event delegation is:

event.target

It refers to the element that actually triggered the event.

Example:

container.addEventListener("click", (event) => {
  console.log(event.target);
});

Clicking Button 1 outputs:

<button>Button 1</button>


--------Why Use Event Delegation?------------
1. Better Performance

Instead of:

1000 listeners

Use:

1. listener
2. Less Memory Usage

Only one callback is stored.

3. Handles Dynamic Elements

Newly added child elements work automatically.

4. Cleaner Code

One centralized event handler.