import {
  createDocumentFragment,
  createElement,
  createNodeIterator,
  createTextNode,
  getElementsByTagName,
  normalize,
} from './utils'

const prepositions = new Set([
  'the',
  'and',
  'in',
  'on',
  'at',
  'by',
  'with',
  'about',
  'against',
  'between',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'to',
  'from',
  'up',
  'down',
  'over',
  'under',
  'again',
  'further',
  'then',
  'once',
  'here',
  'there',
  'when',
  'where',
  'why',
  'how',
  'all',
  'any',
  'both',
  'each',
  'few',
  'more',
  'most',
  'other',
  'some',
])

function isPreposition(word: string): boolean {
  return prepositions.has(word.toLowerCase())
}

function highlightSentence(textNode: Text): Node[] {
  const content = textNode.textContent || ''
  if (/^\s+$/.test(content)) {
    return []
  }
  const nodesList: Node[] = []
  const words = content.split(/(\s+|[.,!?;()])/).filter(Boolean)
  for (const word of words) {
    // english word
    if (/^[a-z]+$/i.test(word)) {
      let boldLength = 0
      if (isPreposition(word)) {
        boldLength = 1
      }
      else if (word.length <= 2) {
        boldLength = 1
      }
      else if (word.length <= 5) {
        boldLength = 2
      }
      else {
        boldLength = Math.min(4, word.length)
      }

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

export interface HighlightOptions {
  inplace?: boolean
  returnDom?: boolean
  returnDomFragment?: boolean
  returnWholeBody?: boolean
}

type HTMLNode = string | Node
export function prehighlight(html: HTMLNode, cfg: HighlightOptions = {}): HTMLNode {
  if (typeof html === 'string' && cfg.inplace) {
    throw new Error('inplace option only works with Node type')
  }

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
  const textNodeIterator = createNodeIterator.call(body.ownerDocument, body, NodeFilter.SHOW_TEXT, null)
  const textNodes: Text[] = []
  while (true) {
    const currentTextNode = textNodeIterator!.nextNode() as Text
    if (!currentTextNode) {
      break
    }
    textNodes.push(currentTextNode)
  }

  textNodes.forEach((textNode) => {
    const highlightedNodes = highlightSentence(textNode as Text)
    textNode.replaceWith(...highlightedNodes)
  })

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
