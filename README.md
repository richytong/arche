# Arche
> Arche (/ˈɑːrki/; Ancient Greek: ἀρχή) is a Greek word with primary senses "beginning", "origin" or "source of action" (ἐξ' ἀρχῆς: from the beginning, οr ἐξ' ἀρχῆς λόγος: the original argument), and later "first principle" or "element". ([wikipedia](https://en.wikipedia.org/wiki/Arche))

React Components at runtime. Create declarative compositions of React Elements without the hassle of transpiling.

```javascript [playground]
const ReactElement = Arche(React) // supply the global React

const {
  Div, H1, P,
} = ReactElement // some sensible default elements are provided as property functions

const myElement = Div([
  H1('I am a heading'),
  P('heyo'),
  P('heyo'),
])

console.log(myElement)
// {
//   $$typeof: Symbol(react.element),
//   type: 'div',
//   props: {
//     children: [
//       { $$typeof: Symbol(react.element), type: 'h1', props: { children: 'I am a heading' } },
//       { $$typeof: Symbol(react.element), type: 'p', props: { children: 'heyo' } },
//       { $$typeof: Symbol(react.element), type: 'p', props: { children: 'heyo' } },
//     ],
//   },
// }
```

Create dynamic components with props:
```javascript [playground]
// props {
//   firstName: string,
//   lastName: string,
//   age: number,
// } => userCard ReactElement
const UserCard = ReactElement(({
  firstName, lastName, age,
}) => Div([
  H1(`${firstName} ${lastName}`),
  P({ style: { color: 'lightgrey' } }, [age]),
]))
```

Complete interop with React hooks (also see [this example](https://reactjs.org/docs/hooks-intro.html)):
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
```

# Installation
with `npm`
```
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
