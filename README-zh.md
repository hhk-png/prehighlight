阅读英文时，如果将英文单词的前几个字母加粗，起到高亮的效果，那么对于不太熟悉英文的人来说，能够帮助其提高注意力，以提升阅读英文的速度。

`prehighlight` 能够对 html 字符串或者 dom 进行处理，高亮每个单词的前几个字母。

![case](./images/case.png)

## Install

```shell
pnpm install prehighlight
```

## Usage

输入 html 字符串：

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

输入 dom：

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

**参数：**

- `html?: string | Node ` : html 字符串，或者 dom 结点。
- `options?: HighlightOptions` : 配置，在下文中有描述。

**返回值：**

- `string | Node`：默认返回 string，如果要返回 dom，请在 options 中添加 `returnDom: true` 选项。

#### HighlightOptions

##### --inplace?: boolean

在原有的 dom 结点上高亮英文字母，此配置只能在 `html` 参数为 dom 的时候才会起作用，如果 html 参数为 string，inplace 设置为了 true，将会报错。设置了 `inplace: true`，prehighlight 的返回值类型也是 Node。

##### --returnDom?: boolean

如果为 true，则 prehighlight 的返回值为 dom 结点，默认为 body 标签下面的 innerHTML。如果为 false，则返回值的类型为 string。

##### --returnDomFragment?: boolean

该配置只有在 returnDom 为 true 的情况下才会生效，单个 `returnDomFragment:true` 不会生效，即 `{returnDom: true, returnDomFragment: true}`。

如果为 true，则返回的 dom 结点是一个 Fragment node。

##### --returnWholeBody?: boolean

如果输入为 `<body><div>hello<div></body>`，默认情况下，返回值为 `<div><b>he<b>llo<div>`，不包括`<body>` 标签。将 `returnWholeBody` 设置为 true 之后，返回值则包括 `<body>` 标签，即 `<body><div><b>he<b>llo<div></body>`。

##### --highlightPrefixLength?: (word: string) => number

该函数用于决定高亮一个单词的前多少个字母，默认情况下，该函数如下。针对某些特殊的单词，比如 **don't, mother-in-law, and/or** 等，会以非字母符号作为分割点输入 `highlightPrefixLength` 当中，**don't** 会拆分为**don** 和 **t**。

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

判断单词是否是特定的英文单词，如果是，则只会对该单词的第一个字母加粗。单词列表如下

```typescript
;[
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
