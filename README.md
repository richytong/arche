# Arche
![arche-logo](https://raw.githubusercontent.com/a-synchronous/assets/master/arche-logo-226x226.png)
> Arche (/ˈɑːrki/; Ancient Greek: ἀρχή) is a Greek word with primary senses "beginning", "origin" or "source of action" (ἐξ' ἀρχῆς: from the beginning, οr ἐξ' ἀρχῆς λόγος: the original argument), and later "first principle" or "element". ([wikipedia](https://en.wikipedia.org/wiki/Arche))

![Node.js CI](https://github.com/richytong/arche/workflows/Node.js%20CI/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/richytong/arche/branch/master/graph/badge.svg)](https://codecov.io/gh/a-synchronous/rubico)

HTML as JavaScript.

```javascript [playground]
const ReactElement = Arche(React)
// supply the React library

const { Div, H1, P } = ReactElement
// some common building blocks are provided on ReactElement
// as property functions.

const myElement = Div([
  H1('I am a heading'),
  P('heyo'),
  P('lorem ipsum'),
])

render(myElement)
// <div>
//   <h1>I am a heading</h1>
//   <p>heyo</p>
//   <p>lorem ipsum</p>
// </div>
```

Create dynamic components with props:
```javascript [playground]
const ReactElement = Arche(React)
const { Div, H1, P, Button, Img } = ReactElement

const UserCard = ReactElement(({
  firstName, lastName, age,
}) => Div([
  H1(`${firstName} ${lastName}`),
  Img({ src: 'https://via.placeholder.com/150x150', alt: 'placeholder' }),
  P({ style: { color: 'lightgrey' } }, `age: ${age}`),
]))

render(UserCard({ firstName: 'George', lastName: 'Henry', age: 32 }))
// <div>
//   <h1>George Henry</h1>
//   <img src="https://via.placeholder.com/150x150" alt="placeholder">
//   <p style="color: lightgrey">age: 32</p>
// </div>
```

Complete interoperability with React hooks (converted from [this example](https://reactjs.org/docs/hooks-intro.html)):
```javascript [playground]
const ReactElement = Arche(React)
const { Div, P, Button } = ReactElement
const { useState } = React

const Example = ReactElement(() => {
  const [count, setCount] = useState(0)

  return Div([
    P(`You clicked ${count} times`),
    Button({
      onClick() {
        setCount(count + 1)
      },
    }, 'Click me'),
  ])
})

render(Example())
// <div>
//   <p>You clicked {count} times</p>
//   <button onclick="setCount(count + 1)">Click me</button>
// </div>
```

Proof of concept: [rubico.land](https://rubico.land/) ([source code](https://github.com/a-synchronous/rubico.land))

# Installation
with `npm`
```bash
npm i arche
```

browser script, global `Arche`
```html
<script src="https://unpkg.com/arche"></script>
```

browser module
```javascript
import Arche from 'https://unpkg.com/arche/es.js'
```

# Syntax
```coffeescript [specscript]
Element = Object

var type string|function,
  props Object,
  children string|Element|Array<string|Element>,
  element Element,
  creator { createElement: (type, props?, children?)=>element },
  rootElement type=>((props, children?)|children)=>element {
    Script: ((props, children?)|children)=>element,
    Html: ((props, children?)|children)=>element,
    Body: (props, children?)|children)=>element,
    Section: (props, children?)|children)=>element,
    Article: (props, children?)|children)=>element,
    Span: (props, children?)|children)=>element,
    Div: (props, children?)|children)=>element,
    Img: (props, children?)|children)=>element,
    H1: (props, children?)|children)=>element,
    H2: (props, children?)|children)=>element,
    H3: (props, children?)|children)=>element,
    H4: (props, children?)|children)=>element,
    H5: (props, children?)|children)=>element,
    H6: (props, children?)|children)=>element,

    A: (props, children?)|children)=>element,
    P: (props, children?)|children)=>element,
    B: (props, children?)|children)=>element,
    Q: (props, children?)|children)=>element,
    I: (props, children?)|children)=>element,
    Ul: (props, children?)|children)=>element,
    Ol: (props, children?)|children)=>element,
    Li: (props, children?)|children)=>element,
    Textarea: (props, children?)|children)=>element,
    Button: (props, children?)|children)=>element,
    Iframe: (props, children?)|children)=>element,
    Blockquote: (props, children?)|children)=>element,
    Br: (props, children?)|children)=>element,
    Code: (props, children?)|children)=>element,
    Pre: (props, children?)|children)=>element,
  }

Arche(creator) -> rootElement
```

