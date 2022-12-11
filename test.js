const assert = require('assert')
const Arche = require('.')

describe('Arche', () => {
  describe('unary creator.createElement - document', () => {
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
        }
      },
      createTextNode(text) {
        return { type: 'text', text }
      }
    }
    const rootElement = Arche(mockDocument)
    const { Div, H1, P, Span, Article } = rootElement

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
        '{"type":"div","children":[{"type":"h1","children":[{"type":"text","text":"header"}],"style":{}},{"type":"p","children":[{"type":"text","text":"description"}],"style":{"color":"grey"}},{"type":"span","children":[],"style":{},"id":"hey","excluded":null},{"type":"div","children":[{"type":"article","children":[{"type":"text","text":"yo"}],"style":{}}],"style":{},"id":"nested"}],"style":{}}')
    })
  })

  describe('3-ary creator.createElement', () => {
    const mockReact = {
      createElement(type, props, ...children) {
        return [type, props || {}, children || []]
      },
    }
    const rootElement = Arche(mockReact)
    const { Div, H1, P, Span, Article } = rootElement

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

    const rootElement = Arche(mockReact, { styled })
    const { Div, H1, P, Span, Article } = rootElement

    it('tree structure 1', () => {
      const el = Div([
        H1({ css: 'h2' }, 'header'), // should swap with h2
        P({ style: { color: 'grey' } }, 'description'),
        Span({ id: 'hey', excluded: null }),
        Div({ id: 'nested' }, [
          Article('yo'),
        ]),
      ])

      assert.strictEqual(
        JSON.stringify(el),
        '["div",{},[["h2",{},["header"]],["p",{"style":{"color":"grey"}},["description"]],["span",{"id":"hey","excluded":null},[]],["div",{"id":"nested"},[["article",{},["yo"]]]]]]')
    })

    it('tree structure 2', () => {
      const el = Div([
        H1('header'),
        P({ css: 'h3', style: { color: 'grey' } }, 'description'),
        Span({ css: 'b', id: 'hey', excluded: null }),
        Div({ css: 'article', id: 'nested' }, [
          Article('yo'),
        ]),
      ])

      assert.strictEqual(
        JSON.stringify(el),
        '["div",{},[["h1",{},["header"]],["h3",{"style":{"color":"grey"}},["description"]],["b",{"id":"hey","excluded":null},[]],["article",{"id":"nested"},[["article",{},["yo"]]]]]]')
    })
  })
})
