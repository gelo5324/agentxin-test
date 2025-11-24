import Quill from 'quill'
const ImageBlot = Quill.import('formats/image');

export default class emoji extends ImageBlot {
	static blotName = 'emoji'
	static tagName = 'img'

	static create(value) {
		const node = super.create(value)
		node.setAttribute('src', ImageBlot.sanitize(value.url))
		node.setAttribute('emoji', value.key)

		node.classList.add('ql-emoji')
		if (value.width) {
			node.setAttribute('width', value.width)
		}
		if (value.height) {
			node.setAttribute('height', value.height)
		}
		return node
	}

	static value(node) {
		return {
			url: node.getAttribute('src'),
			width: node.getAttribute('width'),
			height: node.getAttribute('height')
		}
	}
}