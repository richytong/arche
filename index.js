(function (root, Arche) {
  if (typeof module == 'object') (module.exports = Arche) // CommonJS
  else if (typeof define == 'function') define(() => Arche) // AMD
  else (root.Arche = Arche) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () {

const isArray = Array.isArray

/**
 * @name Arche
 *
 * @synopsis
 * ```coffeescript [specscript]
 * ReactElement = { $$typeof: Symbol(react.element) }
 *
 * var children Array<string|ReactElement>,
 *   props Object
 *
 * Arche(string)(children) -> combinedReactElement ReactElement
 *
 * Arche(string)(props, children) -> combinedReactElementWithProps ReactElement
 *
 * Arche(props=>ReactElement) -> reactComponent props=>ReactElement
 * ```
 *
 * @description
 * React Components at runtime.
 *
 * ```javascript [playground]
 * const ReactElement = Arche(React) // supply the global React
 *
 * const {
 *   Div, H1, P,
 * } = ReactElement // some sensible default elements are provided as property functions
 *
 * const myElement = Div([
 *   H1('I am a heading'),
 *   P('heyo'),
 *   P('heyo'),
 * ])
 *
 * console.log(myElement)
 * // {
 * //   $$typeof: Symbol(react.element),
 * //   type: 'div',
 * //   props: {
 * //     children: [
 * //       { $$typeof: Symbol(react.element), type: 'h1', props: { children: 'I am a heading' } },
 * //       { $$typeof: Symbol(react.element), type: 'p', props: { children: 'heyo' } },
 * //       { $$typeof: Symbol(react.element), type: 'p', props: { children: 'heyo' } },
 * //     ],
 * //   },
 * // }
 * ```
 *
 * Create dynamic components with props:
 * ```javascript
 * // props {
 * //   firstName: string,
 * //   lastName: string,
 * //   age: number,
 * // } => userCard ReactElement
 * const UserCard = ReactElement(({
 *   firstName, lastName, age,
 * }) => Div([
 *   H1(`${firstName} ${lastName}`),
 *   P({ style: { color: 'lightgrey' } }, [age]),
 * ]))
 * ```
 *
 * With hooks:
 * ```javaascript
 * ```
 */

const Arche = function (React) {
  const ReactElement = type => function creatingReactElement(arg0, arg1) {
    if (isArray(arg0)) {
      return React.createElement(type, {}, ...arg0)
    }
    if (typeof arg0 == 'string') {
      return React.createElement(type, {}, arg0)
    }
    return React.createElement(type, arg0, arg1)
  }

  ReactElement.Script = ReactElement('script')
  ReactElement.Html = ReactElement('html')
  ReactElement.Body = ReactElement('body')
  ReactElement.Section = ReactElement('section')
  ReactElement.Article = ReactElement('article')
  ReactElement.Span = ReactElement('span')
  ReactElement.Div = ReactElement('div')
  ReactElement.Img = ReactElement('img')
  ReactElement.H1 = ReactElement('h1')
  ReactElement.H2 = ReactElement('h2')
  ReactElement.H3 = ReactElement('h3')
  ReactElement.H4 = ReactElement('h4')
  ReactElement.H5 = ReactElement('h5')
  ReactElement.H6 = ReactElement('h6')

  ReactElement.A = ReactElement('a')
  ReactElement.P = ReactElement('p')
  ReactElement.B = ReactElement('b')
  ReactElement.Q = ReactElement('q')
  ReactElement.I = ReactElement('i')
  ReactElement.Ul = ReactElement('ul')
  ReactElement.Ol = ReactElement('ol')
  ReactElement.Li = ReactElement('li')
  ReactElement.Textarea = ReactElement('textarea')
  ReactElement.Button = ReactElement('button')
  ReactElement.Iframe = ReactElement('iframe')
  ReactElement.Blockquote = ReactElement('blockquote')
  ReactElement.Br = ReactElement('br')
  ReactElement.Code = ReactElement('code')
  ReactElement.Pre = ReactElement('pre')
  return ReactElement
}

return Arche

}())))
