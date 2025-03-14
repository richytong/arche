# Arche
![arche-logo](https://raw.githubusercontent.com/a-synchronous/assets/master/arche-logo-226x226.png)
> Arche (/ˈɑːrki/; Ancient Greek: ἀρχή) is a Greek word with primary senses "beginning", "origin" or "source of action" (ἐξ' ἀρχῆς: from the beginning, οr ἐξ' ἀρχῆς λόγος: the original argument), and later "first principle" or "element". ([wikipedia](https://en.wikipedia.org/wiki/Arche))

![Node.js CI](https://github.com/richytong/arche/actions/workflows/nodejs.yml/badge.svg)
[![codecov](https://codecov.io/gh/richytong/arche/branch/master/graph/badge.svg)](https://codecov.io/gh/richytong/arche)

HTML as JavaScript. 

```javascript [playground]
const ReactElement = Arche(React)
// supply the React library

const { Div, H1, P } = ReactElement
// some common building blocks are provided on ReactElement
// as property functions.

const myElement = Div([
  H1('I am a heading'),
  P('paragraph'),
  P('lorem ipsum'),
])

render(myElement)
// <div>
//   <h1>I am a heading</h1>
//   <p>paragraph</p>
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
Arche(React {
  createElement: (type, props?, children?)=>ReactElement,
}, options? {
  styled?: {
    div: function,
    p: funcion,
    span: function,
    // etc
  },
  styledMemoizationCap?: number, // defaults to 1000
}) -> ReactElement
```

# Usage
Set Arche elements globally for a great developer experience.
```javascript
// global.js

const ReactElement = Arche(React)

window.ReactElement = ReactElement

for (const elementName in ReactElement) {
  window[elementName] = ReactElement[elementName]
}

// Arche for now does not export every element
// create the ones you need like so
window.Aside = ReactElement('aside')
window.Svg = ReactElement('svg')
window.Path = ReactElement('path')
```

## Using styled
Arche accepts a `styled` option from css-in-js libraries like [Styled Components](https://styled-components.com/) to enable a `css` prop on the base elements. This does not apply to composite components (those created with `ReactElement(props => {...})` syntax)

```javascript
// global.js
const ReactElement = Arche(React, { styled })
```

Elements can now specify a `css` prop to use css-in-js.

```javascript
// MyComponent.js
const MyComponent = ReactElement(props => {
  return Div({
    css: `
      width: 500px;
      background-color: pink;
    `,
  })
})
```

## Using React Context
To use React Context with Arche, wrap `YourContext.Provider` with `ReactElement` and supply `value` as a prop, specifying children in the next argument.

JSX example:
```javascript
function ArticleWrapper () {
  const [theme, setTheme] = React.useState(themes[0])

  return (
    <ThemeContext.Provider value={{
      theme,
      changeTheme: setTheme
    }}>
      <ThemeSwitcher />
      <Article />
    </ThemeContext.Provider>
  )
}
```

Translates to the following with Arche:
```javascript
const ArticleWrapper = ReactElement(() => {
  const [theme, setTheme] = React.useState(themes[0])

  return ReactElement(ThemeContext.Provider)({
    value: { theme, changeTheme: setTheme },
  }, [ThemeSwitcher(), Article()])
})
```
