const assert = require('assert')
const Arche = require('.')

describe('Arche', () => {
  describe('unary creator.createElement - document', () => {
    it('init', async () => {
      assert.throws(
        () => {
          const E1 = Arche()
          console.log(E1)
        },
        new TypeError('creator not defined'),
      )

      globalThis.document = { createElement() {} }

      const E1 = Arche()
      assert.equal(E1.creator, globalThis.document)
    })

    const mockEventListeners = new Map()
    const mockDocument = {
      createElement(type) {
        const children = []
        return {
          type,
          children,
          appendChild(child) {
            children.push(child)
          },
          style: {},
          setAttribute(key, value) {
            this[key] = value
          },
          addEventListener(eventType, listener) {
            if (mockEventListeners.has(eventType)) {
              mockEventListeners.get(eventType).add(listener)
            } else {
              mockEventListeners.set(eventType, new Set([listener]))
            }
          },
        }
      },
      createTextNode(text) {
        return { type: 'text', text }
      }
    }
    const MockElement = Arche(mockDocument)
    const { Div, H1, P, Span, Article, Button } = MockElement

    it('create element directly', async () => {
      const myButton = MockElement('button', { id: 'my-button' }, 'My Button')
      assert.equal(myButton.type, 'button')
      assert.deepEqual(myButton.children, [{ type: 'text', text: 'My Button' }])
      assert.equal(myButton.id, 'my-button')
    })

    it('tree structure', async () => {
      const listener = event => {
        console.log('click', event)
      }

      const el = Div([
        H1('header'),
        P({ style: { color: 'grey' } }, 'description'),
        Span({ id: 'hey', excluded: null }),
        Div({ id: 'nested' }, [
          Article('yo'),
        ]),
        Button({
          disabled: true,
          onClick: listener,
          onMouseOver(event) {
            console.log('onmouseover')
          }
        }),
      ])

      assert.equal(mockEventListeners.size, 2)
      assert(mockEventListeners.has('click'))
      assert(mockEventListeners.has('mouseover'))
      assert.equal(mockEventListeners.get('click').size, 1)
      assert(mockEventListeners.get('click').has(listener))
      assert.equal(mockEventListeners.get('mouseover').size, 1)

      assert.strictEqual(
        JSON.stringify(el),
        '{"type":"div","children":[{"type":"h1","children":[{"type":"text","text":"header"}],"style":{}},{"type":"p","children":[{"type":"text","text":"description"}],"style":{"color":"grey"}},{"type":"span","children":[],"style":{},"id":"hey","excluded":null},{"type":"div","children":[{"type":"article","children":[{"type":"text","text":"yo"}],"style":{}}],"style":{},"id":"nested"},{"type":"button","children":[],"style":{},"disabled":"disabled"}],"style":{}}')
    })
  })

  describe('3-ary creator.createElement', () => {
    const mockReact = {
      createElement(type, props, ...children) {
        return [type, props || {}, children || []]
      },
    }
    const MockReactElement = Arche(mockReact)
    const { Div, H1, P, Span, Article } = MockReactElement

    it('tree structure', async () => {
      const el = Div([
        H1('header'),
        P({ style: { color: 'grey' } }, 'description'),
        Span({ id: 'hey', excluded: null }),
        Div({ id: 'nested' }, [
          Article('yo'),
        ]),
      ])

      assert.strictEqual(
        JSON.stringify(el),
        '["div",{},[["h1",{},["header"]],["p",{"style":{"color":"grey"}},["description"]],["span",{"id":"hey","excluded":null},[]],["div",{"id":"nested"},[["article",{},["yo"]]]]]]')
    })
  })

  describe('styled 3-ary creator.createElement', () => {
    const mockReact = {
      createElement(type, props, ...children) {
        return [type, props || {}, children || []]
      },
    }

    const get0 = value => value[0]

    const styled = {
      h1: get0,
      h2: get0,
      div: get0,
      p: get0,
      b: get0,
      span: get0,
      article: get0,
    }

    const MockReactElement = Arche(mockReact, {
      styled,
      styledMemoizationCap: 1,
    })
    const { Div, H1, P, Span, Article } = MockReactElement

    it('tree structure 1', () => {
      const el = Div([
        H1({ css: 'h2' }, 'header'), // should swap with h2
        H1({ css: 'h2' }, 'header'), // should trigger memoized
        H1({ css: 'h3' }, 'header'), // should add cache
        H1({ css: 'h5' }, 'header'), // should clear cache
        P({ style: { color: 'grey' } }, 'description'),
        Span({ id: 'hey', excluded: null }),
        Div({ id: 'nested' }, [
          Article('yo'),
        ]),
      ])

      assert.strictEqual(
        JSON.stringify(el),
        '["div",{},[["h2",{},["header"]],["h2",{},["header"]],["h3",{},["header"]],["h5",{},["header"]],["p",{"style":{"color":"grey"}},["description"]],["span",{"id":"hey","excluded":null},[]],["div",{"id":"nested"},[["article",{},["yo"]]]]]]')
    })

    it('tree structure 2', () => {
      const el = Div([
        H1('header'),
        P({ css: 'h3', style: { color: 'grey' } }, 'description'),
        Span({ css: 'b', id: 'hey', excluded: null }),
        Div({ css: 'article', id: 'nested' }, [
          Article('yo'),
        ]),
        Span(),
      ])

      assert.strictEqual(
        JSON.stringify(el),
        '["div",{},[["h1",{},["header"]],["h3",{"style":{"color":"grey"}},["description"]],["b",{"id":"hey","excluded":null},[]],["article",{"id":"nested"},[["article",{},["yo"]]]],["span",{},[]]]]')
    })
  })

  it('Typed elements', async () => {
    const mockReact = {
      createElement(type, props, ...children) {
        return [type, props || {}, children || []]
      },
    }
    const MockReactElement = Arche(mockReact)

    assert.equal(typeof MockReactElement.A, 'function')
    assert.equal(MockReactElement.A()[0],'a')
    assert.equal(typeof MockReactElement.P, 'function')
    assert.equal(MockReactElement.P()[0],'p')
    assert.equal(typeof MockReactElement.B, 'function')
    assert.equal(MockReactElement.B()[0],'b')
    assert.equal(typeof MockReactElement.Q, 'function')
    assert.equal(MockReactElement.Q()[0],'q')
    assert.equal(typeof MockReactElement.I, 'function')
    assert.equal(MockReactElement.I()[0],'i')
    assert.equal(typeof MockReactElement.S, 'function')
    assert.equal(MockReactElement.S()[0],'s')
    assert.equal(typeof MockReactElement.U, 'function')
    assert.equal(MockReactElement.U()[0],'u')
    assert.equal(typeof MockReactElement.Ul, 'function')
    assert.equal(MockReactElement.Ul()[0],'ul')
    assert.equal(typeof MockReactElement.Ol, 'function')
    assert.equal(MockReactElement.Ol()[0],'ol')
    assert.equal(typeof MockReactElement.Li, 'function')
    assert.equal(MockReactElement.Li()[0],'li')

    assert.equal(typeof MockReactElement.H1, 'function')
    assert.equal(MockReactElement.H1()[0],'h1')
    assert.equal(typeof MockReactElement.H2, 'function')
    assert.equal(MockReactElement.H2()[0],'h2')
    assert.equal(typeof MockReactElement.H3, 'function')
    assert.equal(MockReactElement.H3()[0],'h3')
    assert.equal(typeof MockReactElement.H4, 'function')
    assert.equal(MockReactElement.H4()[0],'h4')
    assert.equal(typeof MockReactElement.H5, 'function')
    assert.equal(MockReactElement.H5()[0],'h5')
    assert.equal(typeof MockReactElement.H6, 'function')
    assert.equal(MockReactElement.H6()[0],'h6')
    assert.equal(typeof MockReactElement.Hr, 'function')
    assert.equal(MockReactElement.Hr()[0],'hr')
    assert.equal(typeof MockReactElement.Br, 'function')
    assert.equal(MockReactElement.Br()[0],'br')

    assert.equal(typeof MockReactElement.Script, 'function')
    assert.equal(MockReactElement.Script()[0],'script')
    assert.equal(typeof MockReactElement.Style, 'function')
    assert.equal(MockReactElement.Style()[0],'style')

    assert.equal(typeof MockReactElement.Html, 'function')
    assert.equal(MockReactElement.Html()[0],'html')
    assert.equal(typeof MockReactElement.Main, 'function')
    assert.equal(MockReactElement.Main()[0],'main')
    assert.equal(typeof MockReactElement.Body, 'function')
    assert.equal(MockReactElement.Body()[0],'body')
    assert.equal(typeof MockReactElement.Header, 'function')
    assert.equal(MockReactElement.Header()[0],'header')
    assert.equal(typeof MockReactElement.Nav, 'function')
    assert.equal(MockReactElement.Nav()[0],'nav')
    assert.equal(typeof MockReactElement.Section, 'function')
    assert.equal(MockReactElement.Section()[0],'section')
    assert.equal(typeof MockReactElement.Article, 'function')
    assert.equal(MockReactElement.Article()[0],'article')
    assert.equal(typeof MockReactElement.Footer, 'function')
    assert.equal(MockReactElement.Footer()[0],'footer')
    assert.equal(typeof MockReactElement.Span, 'function')
    assert.equal(MockReactElement.Span()[0],'span')
    assert.equal(typeof MockReactElement.Div, 'function')
    assert.equal(MockReactElement.Div()[0],'div')
    assert.equal(typeof MockReactElement.Img, 'function')
    assert.equal(MockReactElement.Img()[0],'img')
    assert.equal(typeof MockReactElement.Video, 'function')
    assert.equal(MockReactElement.Video()[0],'video')
    assert.equal(typeof MockReactElement.Picture, 'function')
    assert.equal(MockReactElement.Picture()[0],'picture')
    assert.equal(typeof MockReactElement.Source, 'function')
    assert.equal(MockReactElement.Source()[0],'source')

    assert.equal(typeof MockReactElement.Form, 'function')
    assert.equal(MockReactElement.Form()[0],'form')
    assert.equal(typeof MockReactElement.Fieldset, 'function')
    assert.equal(MockReactElement.Fieldset()[0],'fieldset')
    assert.equal(typeof MockReactElement.Input, 'function')
    assert.equal(MockReactElement.Input()[0],'input')
    assert.equal(typeof MockReactElement.Label, 'function')
    assert.equal(MockReactElement.Label()[0],'label')
    assert.equal(typeof MockReactElement.Textarea, 'function')
    assert.equal(MockReactElement.Textarea()[0],'textarea')
    assert.equal(typeof MockReactElement.Select, 'function')
    assert.equal(MockReactElement.Select()[0],'select')
    assert.equal(typeof MockReactElement.Option, 'function')
    assert.equal(MockReactElement.Option()[0],'option')

    assert.equal(typeof MockReactElement.Button, 'function')
    assert.equal(MockReactElement.Button()[0],'button')
    assert.equal(typeof MockReactElement.Iframe, 'function')
    assert.equal(MockReactElement.Iframe()[0],'iframe')
    assert.equal(typeof MockReactElement.Blockquote, 'function')
    assert.equal(MockReactElement.Blockquote()[0],'blockquote')
    assert.equal(typeof MockReactElement.Code, 'function')
    assert.equal(MockReactElement.Code()[0],'code')
    assert.equal(typeof MockReactElement.Pre, 'function')
    assert.equal(MockReactElement.Pre()[0],'pre')

    assert.equal(typeof MockReactElement.Polygon, 'function')
    assert.equal(MockReactElement.Polygon()[0],'polygon')
    assert.equal(typeof MockReactElement.Svg, 'function')
    assert.equal(MockReactElement.Svg()[0],'svg')
    assert.equal(typeof MockReactElement.Path, 'function')
    assert.equal(MockReactElement.Path()[0],'path')
    assert.equal(typeof MockReactElement.Rect, 'function')
    assert.equal(MockReactElement.Rect()[0],'rect')
    assert.equal(typeof MockReactElement.Mask, 'function')
    assert.equal(MockReactElement.Mask()[0],'mask')

    assert.equal(typeof MockReactElement.Dl, 'function')
    assert.equal(MockReactElement.Dl()[0],'dl')
    assert.equal(typeof MockReactElement.Dt, 'function')
    assert.equal(MockReactElement.Dt()[0],'dt')
    assert.equal(typeof MockReactElement.Dd, 'function')
    assert.equal(MockReactElement.Dd()[0],'dd')
  })

})
