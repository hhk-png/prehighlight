<div style="text-align:center; font-size:20px;"><a src="./README-zh.md">中文文档 点击跳转</a></div>
When reading in English, **highlighting** the first few letters of each word can help non-native speakers stay focused, improving both comprehension and reading speed.

`prehighlight` processes either an HTML string or a DOM node to bold the first few letters of each English word.

## Install

```shell
pnpm install prehighlight
```

## Usage

**Highlighting an HTML string:**

```typescript
const html = `
    <div>
        <p>The DOM, or Document Object Model</p>
        <p>dangerous</p>
        <p>This is very <i>important</i></p>
    </div>
`
const res = prehighlight(html)
/*
res:
<div>
    <p><b>T</b>he <b>DO</b>M, <b>o</b>r <b>Docu</b>ment <b>Obj</b>ect <b>Mo</b>del</p>
    <p><b>dange</b>rous</p>
    <p><b>Th</b>is <b>i</b>s <b>ve</b>ry <i><b>impor</b>tant</i></p>
</div>
*/
```

**Highlighting a DOM node:**

```typescript
const dom = new DOMParser().parseFromString(
  '<body>hello world</body>',
  'text/html'
)
const res = prehighlight(dom.body)
/*
res:
<b>he</b>llo <b>wo</b>rld
*/
```

## API

### prehighlight

**Parameters:**

- `html?: string | Node` – An HTML string or a DOM node.
- `options?: HighlightOptions` – Configuration options (see below).

**Returns:**

- `string | Node` – Returns a string by default. To return a DOM node instead, set `returnDom: true` in the config.

#### HighlightOptions

##### inplace?: boolean

If `true`, modifies the provided DOM node in-place. Only works when the `html` parameter is a DOM node. Using this with an HTML string will throw an error. When enabled, the return type is a `Node`.

##### returnDom?: boolean

If `true`, returns a DOM node. Defaults to returning the `innerHTML` under the `<body>` tag as a string. Set to `true` to get the node itself.

##### returnDomFragment?: boolean

Only effective if `returnDom` is `true`. This flag alone won’t work—must be used together: `{ returnDom: true, returnDomFragment: true }`. When enabled, returns a document fragment instead of a full DOM node.

##### returnWholeBody?: boolean

By default, if the input is `<body><div>hello</div></body>`, the returned value will be `<div><b>he</b>llo</div>`, excluding the `<body>` tag. Setting this to true will include the `<body>` tag in the output, i.e. `<body><div><b>he</b>llo</div></body>`.

##### highlightPrefixLength?: (word: string) => number

A function to determine how many letters of a word should be highlighted. The default implementation is:

```typescript
function highlightPrefixLength(word: string): number {
  if (isSpecificWord(word)) {
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
```

### isSpecificWord

Determines whether a word is part of a predefined list of common English words. If it is, only the first letter is highlighted. The word list includes:

```typescript
[
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
]
```
