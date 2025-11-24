const defaultOptions = {
	list: [], //emoji资源列表，结构 { key, url }
	width: undefined, //emoji在富文本显示固定宽度，不设置取图片本身宽度
	height: undefined, //emoji在富文本显示固定高度，不设置取图片本身高度
	toolbar: { //操作拦配置
		rowCount: 8, //一行显示多少emoji
		width: 25, //固定宽度
		height: 25, //固定高度
	}
}

export default class emoji {
	static $list
	range = null

	constructor(quill, options) {
		const _options = Object.assign(defaultOptions, options)

		this.elementListInit(quill, _options)
		this.toolbarHandler(quill)
		this.documentHandler(quill)

		quill.on('text-change', () => {
			const range = quill.getSelection()
			if (!range) return;
			this.range = range
		})

		quill.on('selection-change', (range) => {
			if (!range) return;
			this.range = range
		})
	}

	elementListInit(quill, options) {
		const { rowCount, width, height } = options.toolbar
		const listWidth = rowCount * width + 1
		const translateLeft = (listWidth - width) / 2

		this.$list = quill.addContainer('ql-emoji-list')
		this.$list.style.display = 'none'
		this.$list.style.position = 'absolute'
		this.$list.style.top = '0'
		this.$list.style.fontSize = '0'
		this.$list.style.width = `${listWidth}px`
		this.$list.style.transform = `translate(-${translateLeft}px, 0)`
		this.$list.style.backgroundColor = '#fff'
		this.$list.style.borderTop = '0.5px solid #c0bfc5'
		this.$list.style.borderRight = '0.5px solid #c0bfc5'
		this.$list.style.zIndex = '99'

		//一行rowCount个
		const fill = options.list.length % rowCount !== 0 ? (rowCount - options.list.length % rowCount) : 0
		options.list.push(...new Array(fill))

		options.list.forEach(data => {
			const $itemWrap = document.createElement('div')
			$itemWrap.style.display = 'inline-block'
			$itemWrap.style.width = `${width}px`
			$itemWrap.style.height = `${height}px`
			$itemWrap.style.padding = '1%'
			$itemWrap.style.boxSizing = 'border-box'
			$itemWrap.style.borderBottom = '0.5px solid #c0bfc5'
			$itemWrap.style.borderLeft = '0.5px solid #c0bfc5'

			if (data) {
				const $item = document.createElement('div')
				$item.style.height = '100%'
				$item.style.background = `url('${data.url}') no-repeat center center / contain`
				$item.style.cursor = 'pointer'
				$itemWrap.appendChild($item)
				//点击
				$itemWrap.addEventListener('click', () => {
					const index = this.range.index
					const length = this.range.length

					data.width = options.width
					data.height = options.height

					quill.insertEmbed(index, 'image', data.url)
					quill.setSelection({index: index + 1, length}, 'silent') //移动光标
					this.$list.style.display = 'none'
				})
			}

			this.$list.appendChild($itemWrap)
		})
	}

	toolbarHandler(quill) {
		const toolbar = quill.getModule('toolbar')
		toolbar.addHandler('emoji', () => {
			const $icon = toolbar.container.querySelector('.ql-emoji')
			this.$list.style.display = 'block'
			this.$list.style.left = `${$icon.offsetLeft}px` 
			//获取光标
			this.range = quill.getSelection()
		})
	}

	documentHandler(quill) {
		const handler = (evt) => {
			if (!document.body.contains(quill.root)) {
				return document.body.removeEventListener('click', handler)
			}

			const $icon = document.querySelector('.ql-emoji')
			if (!this.$list || !$icon) return;

			const isFoucs = this.$list.contains(evt.target) || $icon.contains(evt.target)
			if (isFoucs) return;
			this.$list.style.display = 'none'
		}

		document.body.addEventListener('click', handler)
	}
}