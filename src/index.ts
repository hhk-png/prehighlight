
interface HighlightOptions {
  inplace?: boolean
  returnDom?: boolean
  returnDomFragment?: boolean
  returnWholeBody?: boolean
}

const {
  getElementsByTagName,
  createNodeIterator,
  createDocumentFragment,
} = document

function createTextNodeIterator(node: Node) {
  return createNodeIterator.call(
    node.ownerDocument,
    node,
    NodeFilter.SHOW_TEXT,
    null
  )
}

export function prehighlight(html: string | Node, cfg: HighlightOptions = {}) {

  if (typeof html === 'string' && cfg.inplace) {
    throw new Error('inplace option only works with Node type')
  }

  const domParser = new DOMParser()
  // body is <body> tag
  let body!: Node
  if (typeof html === 'string') {
    const doc = domParser.parseFromString(html, 'text/html')
    body = getElementsByTagName.call(doc, 'body')[0]
  }
  else {
    // html is Node type
    const doc = domParser.parseFromString('<!---->', 'text/html')
    body = getElementsByTagName.call(doc, 'body')[0]
    const importedNode = body.ownerDocument!.importNode(html, true)

    if (
      importedNode.nodeType === 1 &&
      importedNode.nodeName === 'BODY'
    ) {
      body = importedNode
    }
    else if (importedNode.nodeName === 'HTML') {
      body = getElementsByTagName.call(importedNode, 'body')[0]
    }
    else {
      body.appendChild(importedNode)
    }
  }

  const textNodeIterator = createTextNodeIterator(cfg.inplace ? (html as Node) : body)

  let currentTextNode: Node | null
  let temp
  while ((currentTextNode = textNodeIterator!.nextNode())) {
    // TODO
    temp = currentTextNode.textContent
  }


  if (cfg.returnDom) {
    if (cfg.returnDomFragment) {
      const returnedNode = createDocumentFragment.call(body.ownerDocument)

      while (body.firstChild) {
        returnedNode.appendChild(body.firstChild)
      }

      return returnedNode
    }

    return body
  }

  return cfg.returnWholeBody
    ? (body as HTMLElement).outerHTML
    : (body as HTMLElement).innerHTML
}
