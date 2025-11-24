const romes = [
    'Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ','Ⅺ','Ⅻ','ⅩⅢ','ⅩⅣ','ⅩⅤ','ⅩⅥ','ⅩⅦ','ⅩⅧ','ⅩⅨ','ⅩⅩ'
]
class YinlvRome {
    constructor() {
        this.title = '罗马数字' // 自定义菜单标题
        this.iconSvg = '<svg t="1667312395812" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10283" width="160" height="160"><path d="M896 384V298.666667h-146.730667l18.432-165.973334-84.778666-9.386666L663.466667 298.666667H407.936l18.432-165.973334-84.778667-9.386666L322.133333 298.666667H128v85.333333h184.618667l-28.458667 256H128v85.333333h146.730667l-18.432 165.973334 84.778666 9.429333L360.533333 725.333333h255.488l-18.432 165.973334 84.778667 9.429333L701.866667 725.333333H896v-85.333333h-184.618667l28.458667-256H896z m-270.464 256H370.048l28.458667-256h255.488l-28.458667 256z" p-id="10284"></path></svg>' // 可选
        this.tag = 'button'
        this.showDropPanel = true
    }

    // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
    getValue(editor) {                              // JS 语法
        return ''
    }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(editor) {                    // JS 语法
        return false
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
    getPanelContentElem(editor) {                              // JS 语法
        const $list = document.createElement('div');
        $list.style.display = 'flex';
        $list.style.width = '290px';
        $list.style.flexWrap = 'wrap';
        $list.style.fontSize = '14px';
        for (let i=0,len=romes.length;i<len;i++) {
            const cur = romes[i];
            const $li = document.createElement('div');
            $li.style.width = '32px';
            $li.style.height = '32px';
            $li.style.border = '0.5px solid #c0bfc5';
            $li.style.display = 'flex';
            $li.style.justifyContent = 'center';
            $li.style.alignItems = 'center';
            $li.style.cursor = 'pointer';
            const $text = document.createElement('span');
            $text.innerHTML = cur;
            $li.addEventListener('click', () => {
                editor.dangerouslyInsertHtml(`<span style="fontSize: 20px;">${cur}</span>`);
            })
            $li.appendChild($text);
            $list.appendChild($li);
        }
        return $list // 返回 DOM Element 类型
    }
};

export default YinlvRome;