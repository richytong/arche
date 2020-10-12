# Arche
> Arche (/ˈɑːrki/; Ancient Greek: ἀρχή) is a Greek word with primary senses "beginning", "origin" or "source of action" (ἐξ' ἀρχῆς: from the beginning, οr ἐξ' ἀρχῆς λόγος: the original argument), and later "first principle" or "element". ([wikipedia](https://en.wikipedia.org/wiki/Arche))

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

Complete interop with React hooks (converted from [this example](https://reactjs.org/docs/hooks-intro.html)):
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

Proof of concept: [rubico.land](https://rubico.land/) ([github](https://github.com/a-synchronous/rubico.land))

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
