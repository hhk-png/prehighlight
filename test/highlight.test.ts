import { describe, expect, it } from 'vitest'
import { prehighlight } from '../src/index'

describe('prehighlight config', () => {
  it('options.inplace do not work with string', () => {
    const html = '<div>hello world</div>'
    const options = { inplace: true }
    expect(() => prehighlight(html, options)).toThrowError('inplace option only works with Node type')
  })

  it('options.inplace works with dom', () => {
    const html = new DOMParser().parseFromString('<div>hello world</div>', 'text/html')
    const options = { inplace: true }
    const res = prehighlight(html.body.firstChild!, options)
    expect(res).toBeInstanceOf(Node)
    expect((res as Element).innerHTML).toBe('<b>he</b>llo <b>wo</b>rld')
  })

  it('options.returnDom', () => {
    const html = '<div>hello world</div>'
    const options = { returnDom: true }
    expect(prehighlight(html, options)).toBeInstanceOf(Node)
  })

  it('options.returnDom with options.returnDomFragment', () => {
    const html = '<div>hello world</div>'
    const options = { returnDom: true, returnDomFragment: true }
    const res = prehighlight(html, options) as Element
    expect(res).toBeInstanceOf(DocumentFragment)
    expect(res.childNodes[0].childNodes.length).toBe(4)
  })

  it('options.returnWholeDocument', () => {
    const html = '<div>hello world</div>'
    const options = { returnWholeBody: true }
    expect(prehighlight(html, options)).toBe('<body><div><b>he</b>llo <b>wo</b>rld</div></body>')
  })

  it('highlightPrefixLength', () => {
    const html = '<div>hello world</div>'
    const options = { highlightPrefixLength: (_: string) => 1 }
    expect(prehighlight(html, options)).toBe('<div><b>h</b>ello <b>w</b>orld</div>')
  })
})

describe('highlight dom', () => {
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
    const html = `    <div>
      <p>The DOM, or Document Object Model</p>
      <p>dangerous</p>
      <p>This is very <i>important</i></p>
    </div>`

    const res = prehighlight(html)
    expect(res).toMatchSnapshot()
  })

  it('highlight chinese', () => {
    const html = `<div>你好，世界！</div>`
    const res = prehighlight(html)
    expect(res).toBe('<div>你好，世界！</div>')
  })

  it('empty tag', () => {
    const html = ` <div></div>`
    const res = prehighlight(html)
    expect(res).toBe('<div></div>')
  })

  it('complex html', () => {
    const html = `  <header>
    <h1>Bionic Reading 演示</h1>
    <p>测试复杂结构下的文本渲染</p>
  </header>

  <nav>
    <a href="#">主页</a>
    <a href="#">博客</a>
    <a href="#">项目</a>
    <a href="#">联系</a>
  </nav>

  <article>
    <h2>引言</h2>
    <p>随着信息爆炸式增长，<strong>高效阅读</strong>变得尤为重要。Bionic Reading 通过突出词语的前缀，帮助读者更快识别内容，提高理解力。</p>

    <h2>段落示例</h2>
    <p>在这个段落中，我们会混合使用<strong>粗体</strong>、<em>斜体</em>、超链接以及引用：</p>
    <blockquote>“这是一个引用示例，用于测试 Bionic Reading 的表现。”</blockquote>
    <p>你可以访问<a href="https://www.example.com">这个链接</a>获取更多信息。</p>

    <h2>图片示例</h2>
    <img src="https://via.placeholder.com/600x200" alt="示意图">

    <h2>代码块</h2>
    <pre><code>function greet(name) {
  return 'Hello, ' + name + '!';
}</code></pre>

    <h2>表格</h2>
    <table>
      <thead>
        <tr>
          <th>项目</th>
          <th>状态</th>
          <th>进度</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>页面设计</td>
          <td>完成</td>
          <td>100%</td>
        </tr>
        <tr>
          <td>功能开发</td>
          <td>进行中</td>
          <td>60%</td>
        </tr>
      </tbody>
    </table>
  </article>

  <footer>
    <p>&copy; 2025 示例网站 - Bionic Reading 测试</p>
  </footer>
  <script>
    console.log('This is a script tag.')
  </script>

  `
    const res = prehighlight(html)
    expect(res).toMatchSnapshot()
  })
})

describe('highlight shadow dom', () => {
  it('opened shadow dom', () => {
    class MyCard extends HTMLElement {
      constructor() {
        super()

        const shadowRoot = this.attachShadow({ mode: 'open' })

        shadowRoot.innerHTML = `
        <style>
          .card {
            border: 2px solid #ccc;
            padding: 10px;
          }
          ::slotted(span) {
            color: blue;
          }
        </style>
        <div class="card">
          <h2><slot name="title"></slot></h2> <!-- slot -->
          <slot></slot> <!-- default slot -->
        </div>
      `
      }
    }

    customElements.define('my-card', MyCard)

    const myCardElement = document.createElement('my-card')
    document.body.appendChild(myCardElement)

    const title = document.createElement('span')
    title.setAttribute('slot', 'title')
    title.textContent = 'My Custom Card Title'
    myCardElement.appendChild(title)

    const content = document.createElement('p')
    content.textContent = 'This is some card content.'
    myCardElement.appendChild(content)

    const res = prehighlight(myCardElement)
    expect(res).toMatchSnapshot('opened shadow dom')
  })

  it('closed shadow dom', () => {
    class MyCard extends HTMLElement {
      constructor() {
        super()

        const shadowRoot = this.attachShadow({ mode: 'closed' })

        shadowRoot.innerHTML = `
        <style>
          .card {
            border: 2px solid #ccc;
            padding: 10px;
          }
          ::slotted(span) {
            color: blue;
          }
        </style>
        <div class="card">
          <h2><slot name="title"></slot></h2> <!-- slot -->
          <slot></slot> <!-- default slot -->
        </div>
      `
      }
    }

    customElements.define('my-card-closed', MyCard)

    const myCardElement = document.createElement('my-card-closed')
    document.body.appendChild(myCardElement)

    const title = document.createElement('span')
    title.setAttribute('slot', 'title')
    title.textContent = 'My Custom Card Title'
    myCardElement.appendChild(title)

    const content = document.createElement('p')
    content.textContent = 'This is some card content.'
    myCardElement.appendChild(content)

    const res = prehighlight(myCardElement)
    expect(res).toMatchSnapshot('closed shadow dom')
  })
})
