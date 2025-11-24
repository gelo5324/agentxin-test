import { GetNoteList } from "@/api/meizi";
let icons;
GetNoteList({
    page: 1,
    limit: 100
}).then(res => {
    if(res)icons=res.data;
})
class YinlvIcons {
    constructor() {
        this.title = '音符'
        this.iconSvg = '<svg t="1661014715703" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2406" width="64" height="64"><path d="M977.92 697.344q-7.168 38.912-27.648 69.632-17.408 26.624-52.224 48.128t-94.208 21.504q-38.912 0-73.728-5.12t-61.44-17.408-43.52-32.256-19.968-48.64 8.192-59.904 33.792-56.832 54.784-41.984 70.144-16.384q64.512 0 112.64 22.528l0-428.032-464.896 67.584 4.096 570.368 0 25.6q0 30.72-12.288 59.904t-34.304 51.712-53.248 35.84-69.12 13.312q-40.96 0-75.776-7.68t-61.44-22.528-43.008-36.864-19.456-50.688 8.192-55.808 34.304-48.64 55.296-36.352 70.144-18.944q28.672-4.096 56.32-0.512t52.224 11.776l0-571.392 646.144-93.184 0 651.264z" p-id="2407"></path></svg>'
        this.tag = 'button'
        this.showDropPanel = true
    }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(editor) {                      // JS 语法
        return false
    }

    // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
    getValue(editor) {                               // JS 语法
        return ''
    }

    // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
    isDisabled(editor) {                     // JS 语法
        return false
    }

    // 点击菜单时触发的函数
    exec(editor, value) {                              // JS 语法
        // DropPanel menu ，这个函数不用写，空着即可
    }

    // 定义 DropPanel 内部的 DOM Element
    getPanelContentElem(editor) {                        // JS 语法
        const $list = document.createElement('div');
        $list.style.display = 'flex';
        $list.style.width = '290px';
        $list.style.flexWrap = 'wrap';
        for (let i=0,len=icons.length;i<len;i++) {
            const cur = icons[i];
            const $li = document.createElement('div');
            $li.style.width = '32px';
            $li.style.height = '32px';
            $li.style.border = '0.5px solid #c0bfc5';
            $li.style.display = 'flex';
            $li.style.justifyContent = 'center';
            $li.style.alignItems = 'center';
            // $li.style.background = `url('${cur.item_url_show}') no-repeat center center`;
            // $li.style.backgroundSize = '70%';
            $li.style.cursor = 'pointer';
            const $img = document.createElement('img');
            $img.src = cur.item_url_show;
            // $img.referrerPolicy = 'no-referrer';
            $img.style.width = '24px';
            $img.style.height = '24px';
            $li.addEventListener('click', () => {
                editor.dangerouslyInsertHtml(`<img style="width: 20px; height: 20px;"  src="${cur.item_url_show}" />`);
            })
            $li.appendChild($img);
            $list.appendChild($li);
        }
        return $list // 返回 DOM Element 类型
    }
}

export default YinlvIcons;