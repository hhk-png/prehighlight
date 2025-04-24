import type { HighlightOptions, HighlightPrefixLength, HTMLNode } from './types'
import {
  createDocumentFragment,
  createElement,
  createTextNode,
  getElementsByTagName,
  isPreposition,
  normalize,
  skippedTags,
} from './utils'

function highlightPrefixLength(word: string): number {
  if (isPreposition(word)) {
    return 1
  }
  else if (word.length <= 2) {
    return 1
  }
  else if (word.length <= 5) {
    return 2
  }
  else {
    return Math.ceil(word.length / 2)
  }
}

function highlightSentence(textNode: Text, calculatePrefixLength: HighlightPrefixLength): Node[] {
  // textContent of textNode must not be null
  const content = textNode.textContent!
  // spaces only
  if (/^\s+$/.test(content)) {
    return [createTextNode.call(textNode.ownerDocument, content)]
  }

  const nodesList: Node[] = []
  const words = content.split(/(\s+|[.,!?;()])/).filter(Boolean)
  for (const word of words) {
    // english word
    if (/^[a-z]+$/i.test(word)) {
      const boldLength = calculatePrefixLength(word)

      const boldPart = createElement.call(textNode.ownerDocument, 'b')
      boldPart.textContent = word.slice(0, boldLength)
      const restPart = createTextNode.call(textNode.ownerDocument, word.slice(boldLength))
      nodesList.push(boldPart, restPart)
    }
    else {
      // punctuation and chinese, etc.
      const punctuation = createTextNode.call(textNode.ownerDocument, word)
      nodesList.push(punctuation)
    }
  }

  return nodesList
}

export function prehighlight(html: HTMLNode, cfg: HighlightOptions = {}): HTMLNode {
  if (typeof html === 'string' && cfg.inplace) {
    throw new Error('inplace option only works with Node type')
  }

  const calculatePrefixLength = cfg.highlightPrefixLength || highlightPrefixLength

  const domParser = new DOMParser()
  // body is <body> tag
  let body!: Node
  if (!cfg.inplace) {
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
        importedNode.nodeType === 1
        && importedNode.nodeName === 'BODY'
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
  }

  const textNodes: Text[] = []
  function traverseDOM(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node as Text)
    }
    else if (node.nodeType === Node.ELEMENT_NODE) {
      if (!skippedTags.has((node as Element).tagName)) {
        node.childNodes.forEach(traverseDOM)
      }
    }
  }
  traverseDOM(cfg.inplace ? (html as Node) : body)

  // for concurrent highlight
  // Promise.all(textNodes.map(async (textNode) => {
  //   const nodesList = highlightSentence(textNode)
  //   textNode.replaceWith(...nodesList)
  // }))

  textNodes.forEach((textNode) => {
    const highlightedNodes = highlightSentence(textNode as Text, calculatePrefixLength)
    textNode.replaceWith(...highlightedNodes)
  })

  // normalize html
  normalize.call(html)
  body && normalize.call(body)

  if (cfg.inplace) {
    return html
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
