# Arche
![arche-logo](https://raw.githubusercontent.com/a-synchronous/assets/master/arche-logo-226x226.png)
> Arche (/ˈɑːrki/; Ancient Greek: ἀρχή) is a Greek word with primary senses "beginning", "origin" or "source of action" (ἐξ' ἀρχῆς: from the beginning, οr ἐξ' ἀρχῆς λόγος: the original argument), and later "first principle" or "element". ([wikipedia](https://en.wikipedia.org/wiki/Arche))

![Node.js CI](https://github.com/richytong/arche/actions/workflows/nodejs.yml/badge.svg)
[![codecov](https://codecov.io/gh/richytong/arche/branch/master/graph/badge.svg)](https://codecov.io/gh/richytong/arche)

HTML as JavaScript. 

```javascript
const DocumentElement = Arche()

// Typed DocumenElements are available as properties of DocumentElement
const { Div, H1, P } = DocumentElement

const myElement = Div({ id: 'my-element' }, [
  H1('I am a heading'),
  P('paragraph'),
  P('lorem ipsum'),
])

document.getElementById('#my-container').appendChild(myElement)
// <div id="my-container">
//   <div id="my-element">
//     <h1>I am a heading</h1>
//     <p>paragraph</p>
//     <p>lorem ipsum</p>
//   </div>
// </div>
```

Create dynamic components with props:
```javascript
// provide the React library
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
```javascript
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

## Installation
with `npm`

```bash
npm i arche
```

with browser script, sets `window.Arche`

```html
<script src="https://unpkg.com/arche"></script>
```

with [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
```javascript
import Arche from 'https://unpkg.com/arche/es.js'
```

Set Arche globally for a better developer experience.

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

## Syntax
```coffeescript [specscript]
Arche() -> DocumentElement
Arche(document Document) -> DocumentElement

DocumentElement(
  elementType string,
  props object,
  text string
) -> element Element

DocumentElement(
  elementType string,
  props object,
  children Array<Element|string>
) -> element Element

DocumentElement(elementType string) -> TypedDocumentElement

TypedDocumentElement(props object, text string) -> element Element
TypedDocumentElement(text string) -> element Element
TypedDocumentElement(children Array<Element|string>) -> element Element

TypedDocumentElement.A -> TypedDocumentElement
TypedDocumentElement.P -> TypedDocumentElement
TypedDocumentElement.B -> TypedDocumentElement
TypedDocumentElement.Q -> TypedDocumentElement
TypedDocumentElement.I -> TypedDocumentElement
TypedDocumentElement.Ul -> TypedDocumentElement
TypedDocumentElement.Ol -> TypedDocumentElement
TypedDocumentElement.Li -> TypedDocumentElement
TypedDocumentElement.H1 -> TypedDocumentElement
TypedDocumentElement.H2 -> TypedDocumentElement
TypedDocumentElement.H3 -> TypedDocumentElement
TypedDocumentElement.H4 -> TypedDocumentElement
TypedDocumentElement.H5 -> TypedDocumentElement
TypedDocumentElement.H6 -> TypedDocumentElement
TypedDocumentElement.Hr -> TypedDocumentElement
TypedDocumentElement.Br -> TypedDocumentElement
TypedDocumentElement.Script -> TypedDocumentElement
TypedDocumentElement.Html -> TypedDocumentElement
TypedDocumentElement.Body -> TypedDocumentElement
TypedDocumentElement.Nav -> TypedDocumentElement
TypedDocumentElement.Section -> TypedDocumentElement
TypedDocumentElement.Article -> TypedDocumentElement
TypedDocumentElement.Footer -> TypedDocumentElement
TypedDocumentElement.Span -> TypedDocumentElement
TypedDocumentElement.Div -> TypedDocumentElement
TypedDocumentElement.Img -> TypedDocumentElement
TypedDocumentElement.Video -> TypedDocumentElement
TypedDocumentElement.Form -> TypedDocumentElement
TypedDocumentElement.Fieldset -> TypedDocumentElement
TypedDocumentElement.Input -> TypedDocumentElement
TypedDocumentElement.Label -> TypedDocumentElement
TypedDocumentElement.Textarea -> TypedDocumentElement
TypedDocumentElement.Select -> TypedDocumentElement
TypedDocumentElement.Option -> TypedDocumentElement
TypedDocumentElement.Button -> TypedDocumentElement
TypedDocumentElement.Iframe -> TypedDocumentElement
TypedDocumentElement.Blockquote -> TypedDocumentElement
TypedDocumentElement.Code -> TypedDocumentElement
TypedDocumentElement.Pre -> TypedDocumentElement

Arche(React {
  createElement: (
    elementType string,
    props? object,
    children? string|Array<React.Element|string>
  )=>(reactElement React.Element)
}) -> ReactElement

ReactElement(
  elementType string,
  props object,
  text string
) -> reactElement React.Element

ReactElement(
  elementType string,
  props object,
  children Array<React.Element|string>
) -> reactElement React.Element

ReactElement(elementType string) -> TypedReactElement

TypedReactElement(props object, text string) -> reactElement React.Element
TypedReactElement(text string) -> reactElement React.Element
TypedReactElement(children Array<React.Element|string>) -> reactElement React.Element

ReactElement.A -> TypedReactElement
ReactElement.P -> TypedReactElement
ReactElement.B -> TypedReactElement
ReactElement.Q -> TypedReactElement
ReactElement.I -> TypedReactElement
ReactElement.Ul -> TypedReactElement
ReactElement.Ol -> TypedReactElement
ReactElement.Li -> TypedReactElement
ReactElement.H1 -> TypedReactElement
ReactElement.H2 -> TypedReactElement
ReactElement.H3 -> TypedReactElement
ReactElement.H4 -> TypedReactElement
ReactElement.H5 -> TypedReactElement
ReactElement.H6 -> TypedReactElement
ReactElement.Hr -> TypedReactElement
ReactElement.Br -> TypedReactElement
ReactElement.Script -> TypedReactElement
ReactElement.Html -> TypedReactElement
ReactElement.Body -> TypedReactElement
ReactElement.Nav -> TypedReactElement
ReactElement.Section -> TypedReactElement
ReactElement.Article -> TypedReactElement
ReactElement.Footer -> TypedReactElement
ReactElement.Span -> TypedReactElement
ReactElement.Div -> TypedReactElement
ReactElement.Img -> TypedReactElement
ReactElement.Video -> TypedReactElement
ReactElement.Form -> TypedReactElement
ReactElement.Fieldset -> TypedReactElement
ReactElement.Input -> TypedReactElement
ReactElement.Label -> TypedReactElement
ReactElement.Textarea -> TypedReactElement
ReactElement.Select -> TypedReactElement
ReactElement.Option -> TypedReactElement
ReactElement.Button -> TypedReactElement
ReactElement.Iframe -> TypedReactElement
ReactElement.Blockquote -> TypedReactElement
ReactElement.Code -> TypedReactElement
ReactElement.Pre -> TypedReactElement
```

## Using styled
Arche accepts a `styled` option from css-in-js libraries like [Styled Components](https://styled-components.com/) to enable a `css` prop on `ReactElement` and `TypedReactElement`. This does not apply to composite components (those created with `ReactElement(props => {...})` syntax)

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

## Syntax with styled
```coffeescript [specscript]
([css string])=>(reactElement React.Element) -> StyledComponent

type Styled = {
  h1: StyledComponent,
  h2: StyledComponent,
  h3: StyledComponent,
  h4: StyledComponent,
  h5: StyledComponent,
  div: StyledComponent,
  button: StyledComponent,
  a: StyledComponent,
  p: StyledComponent,
  span: StyledComponent,
  img: StyledComponent,
  ul: StyledComponent,
  ol: StyledComponent,
  li: StyledComponent,
  form: StyledComponent,
  article: StyledComponent,
  main: StyledComponent,
  section: StyledComponent,
  nav: StyledComponent,
}

Arche(React {
  createElement: (
    elementType string,
    props object,
    children? string|Array<React.Element|string>
  )=>(reactElement React.Element)
}, options {
  styled: Styled,
  styledMemoizationCap?: number
}) -> reactElement ReactElement

ReactElement(
  elementType string,
  propsWithCss? { css: string, ...props object },
  text string
) -> reactElement React.Element

ReactElement(elementType string) -> TypedReactElement

TypedReactElement(
  propsWithCss? { css: string, ...props object },
  text string
) -> reactElement React.Element

TypedReactElement(
  propsWithCss? { css: string, ...props object },
  children? string|Array<React.Element|string>
) -> reactElement React.Element
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
