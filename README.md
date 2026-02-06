# Arche
![arche-logo](https://raw.githubusercontent.com/a-synchronous/assets/master/arche-logo-226x226.png)
> Arche (/ˈɑːrki/; Ancient Greek: ἀρχή) is a Greek word with primary senses "beginning", "origin" or "source of action" (ἐξ' ἀρχῆς: from the beginning, οr ἐξ' ἀρχῆς λόγος: the original argument), and later "first principle" or "element".

![Node.js CI](https://github.com/richytong/arche/actions/workflows/nodejs.yml/badge.svg)
[![codecov](https://codecov.io/gh/richytong/arche/branch/master/graph/badge.svg)](https://codecov.io/gh/richytong/arche)
[![npm version](https://img.shields.io/npm/v/arche.svg?style=flat)](https://www.npmjs.com/package/arche)

Simplified DOM interface / React in pure JavaScript.

```javascript [playground]
{
  const DocumentElement = Arche(document)
  const { Div, H1, P } = DocumentElement

  const myElement = Div({ id: 'my-element' }, [
    H1('I am a heading'),
    P('paragraph'),
    P('lorem ipsum'),
  ])

  document.getElementById('dom-container').appendChild(myElement)
}

{
  const ReactElement = Arche(React)
  const { Div, H1, P, Button, Img } = ReactElement

  const UserCard = ReactElement(({
    firstName, lastName, age,
  }) => Div([
    H1(`${firstName} ${lastName}`),
    Img({ src: 'https://via.placeholder.com/150x150', alt: 'placeholder' }),
    P({ style: { color: 'lightgrey' } }, `age: ${age}`),
  ]))

  ReactDOM.render(
    UserCard({ firstName: 'Example', lastName: 'Name', age: 32 }),
    document.getElementById('react-root')
  )
}
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

Set `DocumentElement` globally for a better developer experience.

```javascript
// global.js
const DocumentElement = Arche()

window.DocumentElement = DocumentElement

for (const elementName in DocumentElement) {
  window[elementName] = DocumentElement[elementName]
}

// set missing elements
window.Aside = DocumentElement('aside')
window.Svg = DocumentElement('svg')
window.Path = DocumentElement('path')
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
DocumentElement.A -> TypedDocumentElement
DocumentElement.P -> TypedDocumentElement
DocumentElement.B -> TypedDocumentElement
DocumentElement.Q -> TypedDocumentElement
DocumentElement.I -> TypedDocumentElement
DocumentElement.Ul -> TypedDocumentElement
DocumentElement.Ol -> TypedDocumentElement
DocumentElement.Li -> TypedDocumentElement
DocumentElement.H1 -> TypedDocumentElement
DocumentElement.H2 -> TypedDocumentElement
DocumentElement.H3 -> TypedDocumentElement
DocumentElement.H4 -> TypedDocumentElement
DocumentElement.H5 -> TypedDocumentElement
DocumentElement.H6 -> TypedDocumentElement
DocumentElement.Hr -> TypedDocumentElement
DocumentElement.Br -> TypedDocumentElement
DocumentElement.Script -> TypedDocumentElement
DocumentElement.Html -> TypedDocumentElement
DocumentElement.Body -> TypedDocumentElement
DocumentElement.Nav -> TypedDocumentElement
DocumentElement.Section -> TypedDocumentElement
DocumentElement.Article -> TypedDocumentElement
DocumentElement.Footer -> TypedDocumentElement
DocumentElement.Span -> TypedDocumentElement
DocumentElement.Div -> TypedDocumentElement
DocumentElement.Img -> TypedDocumentElement
DocumentElement.Video -> TypedDocumentElement
DocumentElement.Form -> TypedDocumentElement
DocumentElement.Fieldset -> TypedDocumentElement
DocumentElement.Input -> TypedDocumentElement
DocumentElement.Label -> TypedDocumentElement
DocumentElement.Textarea -> TypedDocumentElement
DocumentElement.Select -> TypedDocumentElement
DocumentElement.Option -> TypedDocumentElement
DocumentElement.Button -> TypedDocumentElement
DocumentElement.Iframe -> TypedDocumentElement
DocumentElement.Blockquote -> TypedDocumentElement
DocumentElement.Code -> TypedDocumentElement
DocumentElement.Pre -> TypedDocumentElement

TypedDocumentElement(props object, text string) -> element Element
TypedDocumentElement(text string) -> element Element
TypedDocumentElement(props object, children Array<Element|string>) -> element Element
TypedDocumentElement(children Array<Element|string>) -> element Element
```

## Using React
To use Arche with [React](https://react.dev/), simply provide the React library.

```javascript
const ReactElement = Arche(React)
```

Create dynamic components with props.

```javascript
const ReactElement = Arche(React)

const { Div, H1, P, Button, Img } = ReactElement

const UserCard = ReactElement(({
  firstName, lastName, age,
}) => Div([
  H1(`${firstName} ${lastName}`),
  Img({ src: 'https://via.placeholder.com/150x150', alt: 'placeholder' }),
  P({ style: { color: 'lightgrey' } }, `age: ${age}`),
]))

render(UserCard({ firstName: 'Example', lastName: 'Name', age: 32 }))
// <div>
//   <h1>Example Name</h1>
//   <img src="https://via.placeholder.com/150x150" alt="placeholder">
//   <p style="color: lightgrey">age: 32</p>
// </div>
```

Complete interoperability with React hooks (converted from [this example](https://reactjs.org/docs/hooks-intro.html)).

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

Set `ReactElement` globally for a better developer experience.

```javascript
// global.js
const ReactElement = Arche(React)

window.ReactElement = ReactElement

for (const elementName in ReactElement) {
  window[elementName] = ReactElement[elementName]
}

// set missing elements
window.Aside = ReactElement('aside')
window.Svg = ReactElement('svg')
window.Path = ReactElement('path')
```

## Syntax with React

```coffeescript [specscript]
type React = {
  createElement: (
    elementType string,
    props object,
    children string|Array<React.Element|string>
  )=>(reactElement React.Element)
}

Arche(React) -> ReactElement

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

TypedReactElement(props object, text string) -> reactElement React.Element
TypedReactElement(text string) -> reactElement React.Element

TypedReactElement(
  props object,
  children Array<React.Element|string>
) -> reactElement React.Element

TypedReactElement(children Array<React.Element|string>) -> reactElement React.Element
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

## Using styled
Arche accepts a `styled` option from css-in-js libraries like [Styled Components](https://styled-components.com/) to enable a `css` prop on `ReactElement` and `TypedReactElement`.

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
    textOrChildren string|Array<React.Element|string>
  )=>(reactElement React.Element)
}, options {
  styled: Styled,
  styledMemoizationCap?: number
}) -> reactElement ReactElement

ReactElement(
  elementType string,
  propsWithCss { css: string, ...props object },
  text string
) -> reactElement React.Element

ReactElement(
  elementType string,
  propsWithCss { css: string, ...props object },
  children Array<React.Element|string>
) -> reactElement React.Element

ReactElement(elementType string) -> TypedReactElement
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

TypedReactElement(
  propsWithCss { css: string, ...props object },
  text string
) -> reactElement React.Element

TypedReactElement(text string) -> reactElement React.Element

TypedReactElement(
  propsWithCss { css: string, ...props object },
  children Array<React.Element|string>
) -> reactElement React.Element

TypedReactElement(children Array<React.Element|string>) -> reactElement React.Element
```

# Contributing
Your feedback and contributions are welcome. If you have a suggestion, please raise an issue. Prior to that, please search through the issues first in case your suggestion has been made already. If you decide to work on an issue, please create a pull request.

Pull requests should provide some basic context and link the relevant issue. Here is an [example pull request](https://github.com/a-synchronous/rubico/pull/12). If you are interested in contributing, the [help wanted](https://github.com/richytong/arche/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) tag is a good place to start.

For more information please see [CONTRIBUTING.md](/CONTRIBUTING.md)

# License
Arche is [MIT Licensed](https://github.com/a-synchronous/rubico/blob/master/LICENSE).

# Support
 * minimum Node.js version: 14
 * minimum Chrome version: 63
 * minimum Firefox version: 57
 * minimum Edge version: 79
 * minimum Safari version: 11.1
