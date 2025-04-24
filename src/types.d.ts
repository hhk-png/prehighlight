export type HighlightPrefixLength = (word: string) => number

export interface HighlightOptions {
  inplace?: boolean
  returnDom?: boolean
  returnDomFragment?: boolean
  returnWholeBody?: boolean
  highlightPrefixLength?: HighlightPrefixLength
}

type HTMLNode = string | Node
