/**
 * Arche v0.3.11
 * https://github.com/richytong/arche
 * (c) 2025 Richard Tong
 * Arche may be freely distributed under the MIT license.
 */

const isArray = Array.isArray

/**
 * @name elementSetAttribute
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Element = Object
 *
 * var element Element,
 *   key string,
 *   value string|number|Object,
 *
 * elementSetAttribute(element, key, value) -> element
 * ```
 */
const elementSetAttribute = function (element, key, value) {
  if (value == null) { // boolean
    element.setAttribute(key, value)
  }
  else if (typeof value == 'boolean') {
    if (value) {
      element.setAttribute(key, key)
    } else {
      element.removeAttribute(key)
    }
  }
  else if (value.constructor == Object) { // style
    for (const subKey in value) {
      element[key][subKey] = value[subKey]
    }
  }
  else if (typeof value == 'function') { // onClick
    const eventType = key.toLowerCase().replace(/^on/, '')
    element.addEventListener(eventType, value)
  }
  else {
    element.setAttribute(key, value)
  }
  return element
}

/**
 * @name memoizeCappedWithResolver
 *
 * @synopsis
 * ```coffeescript [specscript]
 * memoizeCappedWithResolver(
 *   func function,
 *   cap number,
 *   resolver function,
 * ) -> memoized function
 * ```
 *
 * @description
 * Memoize a function with a resolver. Clear cache when size reaches cap.
 */

const memoizeCappedWithResolver = function (func, cap, resolver) {
  const cache = new Map()
  const memoized = function (...args) {
    if (cache.size > cap) {
      cache.clear()
    }
    const key = resolver(...args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = func(...args)
    cache.set(key, result)
    return result
  }
  memoized.cache = cache
  return memoized
}

/**
 * @name creatorCreateElement
 *
 * @synopsis
 * ```coffeescript [specscript]
 * creator {
 *   createElement: (
 *     elementType string,
 *     props? object,
 *     children? Array<creator.Element>
 *   )=>creator.Element
 * }
 *
 * creatorCreateElement(
 *   creator,
 *   elementType string|function,
 *   propsOrTextOrChildren object|string|Array,
 *   textOrChildren string|Array,
 * ) -> creator.Element
 * ```
 */
function creatorCreateElement(
  creator,
  elementType,
  propsOrTextOrChildren,
  textOrChildren
) {
  if (creator.createElement.length == 1) {
    const element = creator.createElement(elementType) // document.createElement
    for (const key in propsOrTextOrChildren) {
      elementSetAttribute(element, key, propsOrTextOrChildren[key])
    }
    const childrenLength = textOrChildren.length
    let childrenIndex = -1
    while (++childrenIndex < childrenLength) {
      const child = textOrChildren[childrenIndex]
      if (typeof child == 'string') {
        element.appendChild(creator.createTextNode(child))
      } else {
        element.appendChild(child)
      }
    }
    return element
  }

  return creator.createElement(
    elementType,
    propsOrTextOrChildren,
    ...textOrChildren
  )
}

/**
 * @name CreatorElement
 *
 * @synopsis
 * ```coffeescript [specscript]
 * CreatorElement(
 *   creator {
 *     createElement: (
 *       elementType string,
 *       props? object,
 *       children? Array<creator.Element>
 *     )=>creator.Element
 *   },
 *   elementType string,
 *   propsOrTextOrChildren object|string|Array,
 *   textOrChildren string|Array,
 * )
 *   -> creator.Element
 * ```
 */
function CreatorElement(
  creator,
  elementType,
  propsOrTextOrChildren,
  textOrChildren
) {
  if (isArray(propsOrTextOrChildren)) {
    return creatorCreateElement(
      creator,
      elementType,
      {},
      propsOrTextOrChildren
    )
  }

  if (typeof propsOrTextOrChildren == 'string') {
    return creatorCreateElement(
      creator,
      elementType,
      {},
      [propsOrTextOrChildren]
    )
  }

  if (isArray(textOrChildren)) {
    return creatorCreateElement(
      creator,
      elementType,
      propsOrTextOrChildren,
      textOrChildren
    )
  }

  if (textOrChildren == null) {
    return creatorCreateElement(
      creator,
      elementType,
      propsOrTextOrChildren,
      []
    )
  }

  return creatorCreateElement(
    creator,
    elementType,
    propsOrTextOrChildren,
    [textOrChildren]
  )
}


/**
 * @name __CreatorElement
 *
 * @synopsis
 * ```coffeescript [specscript]
 * creator {
 *   createElement: (
 *     elementType string,
 *     props? object,
 *     children? Array<creator.Element>
 *   )=>creator.Element
 * }
 *
 * __CreatorElement(creator elementType string) -> _Element function
 *
 * _Element(
 *   propsOrTextOrChildren object|string|Array,
 *   textOrChildren string|Array,
 * ) -> creator.Element
 * ```
 */
function __CreatorElement(creator, elementType) {
  return function _CreatorElement(propsOrTextOrChildren, textOrChildren) {
    return CreatorElement(
      creator,
      elementType,
      propsOrTextOrChildren,
      textOrChildren
    )
  }
}

/**
 * @name _CreatorElement
 *
 * @synopsis
 * ```coffeescript [specscript]
 * args Array
 *
 * creator {
 *   createElement: (
 *     elementType string,
 *     props? object,
 *     children? Array<creator.Element>
 *   )=>creator.Element
 * }
 *
 * _CreatorElement(creator) -> _Element (...args)=>creator.Element
 * ```
 */
function _CreatorElement(creator) {
  return function _Element(...args) {
    if (args.length == 1) {
      return __CreatorElement(creator, args[0])
    }
    return CreatorElement(creator, ...args)
  }
}

/**
 * @name $__StyledCreatorElement
 *
 * @synopsis
 * ```coffeescript [specscript]
 * creator {
 *   createElement: (
 *     elementType string,
 *     props? object,
 *     children? Array<creator.Element>
 *   )=>creator.Element
 * }
 *
 * $__StyledCreatorElement(
 *   creator,
 *   options {
 *     styled Styled,
 *     styledMemoizationCap number,
 *   }
 * ) -> _StyledCreatorElement function
 *
 * _StyledCreatorElement(elementType string) -> _StyledElement function
 *
 * _StyledElement(
 *   propsOrTextOrChildren object|string|Array,
 *   textOrChildren string|Array,
 * ) -> creator.Element
 * ```
 */
function $__StyledCreatorElement(creator, options) {
  const { styled, styledMemoizationCap } = options
  return function _StyledCreatorElement(elementType) {
    const styledComponent = memoizeCappedWithResolver(
      styled[elementType],
      styledMemoizationCap,
      array => array[0],
    )

    return function _StyledElement(propsOrTextOrChildren, textOrChildren) {
      if (isArray(propsOrTextOrChildren)) {
        return creatorCreateElement(
          creator,
          elementType,
          {},
          propsOrTextOrChildren
        )
      }

      if (typeof propsOrTextOrChildren == 'string') {
        return creatorCreateElement(
          creator,
          elementType,
          {},
          [propsOrTextOrChildren]
        )
      }

      if (isArray(textOrChildren)) {
        if (propsOrTextOrChildren == null || propsOrTextOrChildren.css == null) {
          return creatorCreateElement(
            creator,
            elementType,
            propsOrTextOrChildren,
            textOrChildren
          )
        }
        const { css, ...props } = propsOrTextOrChildren
        return creatorCreateElement(
          creator,
          styledComponent([css]),
          props,
          textOrChildren
        )
      }

      if (textOrChildren == null) {
        if (propsOrTextOrChildren == null || propsOrTextOrChildren.css == null) {
          return creatorCreateElement(
            creator,
            elementType,
            propsOrTextOrChildren,
            []
          )
        }
        const { css, ...props } = propsOrTextOrChildren
        return creatorCreateElement(creator, styledComponent([css]), props, [])
      }

      if (propsOrTextOrChildren == null || propsOrTextOrChildren.css == null) {
        return creatorCreateElement(
          creator,
          elementType,
          propsOrTextOrChildren,
          [textOrChildren]
        )
      }

      const { css, ...props } = propsOrTextOrChildren
      return creatorCreateElement(
        creator,
        styledComponent([css]),
        props,
        [textOrChildren]
      )
    }
  }
}

/**
 * @name __assignElementNames
 *
 * @synopsis
 * ```coffeescript [specscript]
 * creator {
 *   createElement: (
 *     elementType string,
 *     props? object,
 *     children? Array<creator.Element>
 *   )=>creator.Element
 * }
 *
 * __assignElementNames(CreatorElement creator.Element) -> ()
 * ```
 */
function __assignElementNames(CreatorElement) {
  CreatorElement.A = CreatorElement('a')
  CreatorElement.P = CreatorElement('p')
  CreatorElement.B = CreatorElement('b')
  CreatorElement.Q = CreatorElement('q')
  CreatorElement.I = CreatorElement('i')
  CreatorElement.Ul = CreatorElement('ul')
  CreatorElement.Ol = CreatorElement('ol')
  CreatorElement.Li = CreatorElement('li')

  CreatorElement.H1 = CreatorElement('h1')
  CreatorElement.H2 = CreatorElement('h2')
  CreatorElement.H3 = CreatorElement('h3')
  CreatorElement.H4 = CreatorElement('h4')
  CreatorElement.H5 = CreatorElement('h5')
  CreatorElement.H6 = CreatorElement('h6')
  CreatorElement.Hr = CreatorElement('hr')
  CreatorElement.Br = CreatorElement('br')

  CreatorElement.Script = CreatorElement('script')
  CreatorElement.Html = CreatorElement('html')
  CreatorElement.Body = CreatorElement('body')
  CreatorElement.Nav = CreatorElement('nav')
  CreatorElement.Section = CreatorElement('section')
  CreatorElement.Article = CreatorElement('article')
  CreatorElement.Footer = CreatorElement('footer')
  CreatorElement.Span = CreatorElement('span')
  CreatorElement.Div = CreatorElement('div')
  CreatorElement.Img = CreatorElement('img')
  CreatorElement.Video = CreatorElement('video')

  CreatorElement.Form = CreatorElement('form')
  CreatorElement.Fieldset = CreatorElement('fieldset')
  CreatorElement.Input = CreatorElement('input')
  CreatorElement.Label = CreatorElement('label')
  CreatorElement.Textarea = CreatorElement('textarea')
  CreatorElement.Select = CreatorElement('select')
  CreatorElement.Option = CreatorElement('option')

  CreatorElement.Button = CreatorElement('button')
  CreatorElement.Iframe = CreatorElement('iframe')
  CreatorElement.Blockquote = CreatorElement('blockquote')
  CreatorElement.Code = CreatorElement('code')
  CreatorElement.Pre = CreatorElement('pre')
}

/**
 * @name Arche
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Element = Object
 *
 * type string|function
 * props Object
 * children string|Object|Array<string|Object>
 * element Element
 * creator {
 *   createElement: (type, props?, children?)=>element,
 * }
 * rootElement type=>((props, children?)|children)=>element {
 *   Script: ((props, children?)|children)=>element,
 *   Html: ((props, children?)|children)=>element,
 *   Body: (props, children?)|children)=>element,
 *   Section: (props, children?)|children)=>element,
 *   Article: (props, children?)|children)=>element,
 *   Span: (props, children?)|children)=>element,
 *   Div: (props, children?)|children)=>element,
 *   Img: (props, children?)|children)=>element,
 *   H1: (props, children?)|children)=>element,
 *   H2: (props, children?)|children)=>element,
 *   H3: (props, children?)|children)=>element,
 *   H4: (props, children?)|children)=>element,
 *   H5: (props, children?)|children)=>element,
 *   H6: (props, children?)|children)=>element,
 *
 *   A: (props, children?)|children)=>element,
 *   P: (props, children?)|children)=>element,
 *   B: (props, children?)|children)=>element,
 *   Q: (props, children?)|children)=>element,
 *   I: (props, children?)|children)=>element,
 *   Ul: (props, children?)|children)=>element,
 *   Ol: (props, children?)|children)=>element,
 *   Li: (props, children?)|children)=>element,
 *   Textarea: (props, children?)|children)=>element,
 *   Button: (props, children?)|children)=>element,
 *   Iframe: (props, children?)|children)=>element,
 *   Blockquote: (props, children?)|children)=>element,
 *   Br: (props, children?)|children)=>element,
 *   Code: (props, children?)|children)=>element,
 *   Pre: (props, children?)|children)=>element,
 * }
 *
 * Arche(creator, options {
 *   styled?: Styled,
 *   styledMemoizationCap?: number,
 * }) -> rootElement
 * ```
 *
 * @description
 * > Arche (/ˈɑːrki/; Ancient Greek: ἀρχή) is a Greek word with primary senses "beginning", "origin" or "source of action" (ἐξ' ἀρχῆς: from the beginning, οr ἐξ' ἀρχῆς λόγος: the original argument), and later "first principle" or "element". ([wikipedia](https://en.wikipedia.org/wiki/Arche))
 *
 * HTML as JavaScript.
 *
 * ```javascript [playground]
 * const ReactElement = Arche(React)
 * // supply the React library
 *
 * const { Div, H1, P } = ReactElement
 * // some common building blocks are provided on ReactElement
 * // as property functions.
 *
 * const myElement = Div([
 *   H1('I am a heading'),
 *   P('heyo'),
 *   P('lorem ipsum'),
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
 * ```javascript [playground]
 * const ReactElement = Arche(React)
 * const { Div, P, Button } = ReactElement
 *
 * const UserCard = ReactElement(({
 *   firstName, lastName, age,
 * }) => Div([
 *   H1(`${firstName} ${lastName}`),
 *   P({ style: { color: 'lightgrey' } }, [age]),
 * ]))
 * ```
 *
 * Complete interop with React hooks (converted from [this example](https://reactjs.org/docs/hooks-intro.html)):
 * ```javascript [playground]
 * const ReactElement = Arche(React)
 * const { Div, P, Button } = ReactElement
 * const { useState } = React
 *
 * const Example = ReactElement(() => {
 *   const [count, setCount] = useState(0)
 *
 *   return Div([
 *     P(`You clicked ${count} times`),
 *     Button({
 *       onClick() {
 *         setCount(count + 1)
 *       },
 *     }, 'Click me'),
 *   ])
 * })
 * ```
 */

const Arche = function (creator, options = {}) {
  if (creator == null && typeof document != 'undefined') {
    creator = document
  }

  if (creator == null) {
    throw new TypeError('creator not defined')
  }

  const {
    styled,
    styledMemoizationCap = 1000,
  } = options

  const OriginalCreatorElement = _CreatorElement(creator)

  const StyledCreatorElement = $__StyledCreatorElement(creator, {
    styled,
    styledMemoizationCap,
  })

  const CreatorElement = (
    styled == null
    ? OriginalCreatorElement
    : type => typeof type == 'string'
      ? StyledCreatorElement(type)
      : OriginalCreatorElement(type)
  )

  CreatorElement.creator = creator
  __assignElementNames(CreatorElement)

  return CreatorElement
}

export default Arche
