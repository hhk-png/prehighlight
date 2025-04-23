import { describe, expect, it } from 'vitest'
import { prehighlight } from '../src/index'

describe.skip('prehighlight config', () => {
  it('cfg.inplace do not work with string', () => {
    const html = '<div>hello world</div>'
    const cfg = { inplace: true }
    expect(() => prehighlight(html, cfg)).toThrowError('inplace option only works with Node type')
  })

  it('cfg.inplace works with dom', () => {
    const html = new DOMParser().parseFromString('<div>hello world</div>', 'text/html')
    const cfg = { inplace: true }
    const res = prehighlight(html.body.firstChild!, cfg)
    expect(res).toBeInstanceOf(Node)
    expect((res as Element).innerHTML).toBe('<b>he</b>llo <b>wo</b>rld')
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
    expect(res.childNodes[0].childNodes.length).toBe(4)
  })

  it('cfg.returnWholeDocument', () => {
    const html = '<div>hello world</div>'
    const cfg = { returnWholeBody: true }
    expect(prehighlight(html, cfg)).toBe('<body><div><b>he</b>llo <b>wo</b>rld</div></body>')
  })
})

describe.skip('highlight dom', () => {
  it('highlight dom', () => {
    const dom = new DOMParser().parseFromString('<div>hello world</div>', 'text/html')
    expect(prehighlight(dom.body.firstChild!)).toBe('<div><b>he</b>llo <b>wo</b>rld</div>')
  })

  it('highlight dom with <body>', () => {
    const dom = new DOMParser().parseFromString('<body>hello world</body>', 'text/html')
    expect(prehighlight(dom.body)).toBe('<b>he</b>llo <b>wo</b>rld')
  })

  it('highlight dom with <html>', () => {
    const dom = new DOMParser().parseFromString('<html><body>hello world</body></html>', 'text/html')
    expect(prehighlight(dom.documentElement)).toBe('<b>he</b>llo <b>wo</b>rld')
  })
})

describe('hightlight complex html', () => {
  it('english', () => {
    // const html = '<div>'
    // +'<p>The DOM, or Document Object Model</p>'
    // +'<p>dangerous</p>'
    // +'<p>This is very <i>important</i></p>    '
    // +'</div>'

    const html = `    <div>
      <p>The DOM, or Document Object Model</p>
      <p>dangerous</p>
      <p>This is very <i>important</i></p>
    </div>`

    const res = prehighlight(html)
    expect(res).toBeDefined()
  })
})
