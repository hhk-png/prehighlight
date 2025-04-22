import { describe, expect, it } from 'vitest'
import { prehighlight } from '../src/index'

describe('prehighlight config', () => {
  it('cfg.inplace do not work with string', () => {
    const html = '<div>hello world</div>'
    const cfg = { inplace: true }
    expect(() => prehighlight(html, cfg)).toThrowError('inplace option only works with Node type')
  })

  it('cfg.inplace works with dom', () => {
    const html = new DOMParser().parseFromString('<div>hello world</div>', 'text/html')
    const cfg = { inplace: true }
    expect(prehighlight(html.body.firstChild!, cfg)).toBe('<div>hello world</div>')
  })

  it('cfg.returnDom', () => {
    const html = '<div>hello world</div>'
    const cfg = { returnDom: true }
    expect(prehighlight(html, cfg)).toBeInstanceOf(Node)
  })

  it('cfg.returnDom with cfg.returnDomFragment', () => {
    const html = '<div>hello world</div>'
    const cfg = { returnDom: true, returnDomFragment: true }
    const res = prehighlight(html, cfg) as Element
    expect(res).toBeInstanceOf(DocumentFragment)
    expect(res.childNodes.length).toBe(1)
  })

  it('cfg.returnWholeDocument', () => {
    const html = '<div>hello world</div>'
    const cfg = { returnWholeBody: true }
    expect(prehighlight(html, cfg)).toBe('<body><div>hello world</div></body>')
  })
})

describe('highlight dom', () => {
  it('highlight dom', () => {
    const dom = new DOMParser().parseFromString('<div>hello world</div>', 'text/html')
    expect(prehighlight(dom.body.firstChild!)).toBe('<div>hello world</div>')
  })

  it('highlight dom with <body>', () => {
    const dom = new DOMParser().parseFromString('<body>hello world</body>', 'text/html')
    expect(prehighlight(dom.body)).toBe('hello world')
  })

  it('highlight dom with <html>', () => {
    const dom = new DOMParser().parseFromString('<html><body>hello world</body></html>', 'text/html')
    expect(prehighlight(dom.documentElement)).toBe('hello world')
  })
})

