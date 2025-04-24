const {
  getElementsByTagName,
  createDocumentFragment,
  createTextNode,
  createElement,
  normalize,
} = document

export {
  createDocumentFragment,
  createElement,
  createTextNode,
  getElementsByTagName,
  normalize,
}

export const prepositions = new Set([
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

export function isPreposition(word: string): boolean {
  return prepositions.has(word.toLowerCase())
}

export const skippedTags = new Set([
  'PRE',
  'CODE',
  'SCRIPT',
  'STYLE',
  'TITLE',
  'HEAD',
  'META',
  'LINK',
  'NOSCRIPT',
])
