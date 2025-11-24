import Quill from 'quill'
import icon from './assets/emoji'
import formatterEmoji from './formatterEmoji'
import moduleEmoji from './moduleEmoji'
//设置图标
const icons = Quill.import('ui/icons')
icons.emoji = icon

Quill.register({
    'formats/emoji': formatterEmoji,
    'modules/emoji': moduleEmoji,
}, true)