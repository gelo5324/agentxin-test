class YinlvInput {
    constructor() {
        this.title = '输入框' // 自定义菜单标题
        this.iconSvg = '<svg t="1661020528664" class="icon" viewBox="0 0 1975 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2578" width="64" height="64"><path d="M1933.276831 981.457416H42.542584V42.542584h1890.734247v938.914832" fill="#FFFFFF" p-id="2579"></path><path d="M1933.276831 1024H42.542584a42.542584 42.542584 0 0 1-42.542584-42.542584V42.542584a42.542584 42.542584 0 0 1 42.542584-42.542584h1890.734247a42.542584 42.542584 0 0 1 42.542585 42.542584v938.914832a42.542584 42.542584 0 0 1-42.542585 42.542584zM85.085168 938.914832h1805.649079V85.085168H85.085168z" fill="#888888" p-id="2580"></path><path d="M314.247888 266.174768h121.813599" fill="#FFFFFF" p-id="2581"></path><path d="M436.061487 308.717352h-121.813599a42.542584 42.542584 0 0 1 0-85.085168h121.813599a42.542584 42.542584 0 0 1 0 85.085168z" fill="#888888" p-id="2582"></path><path d="M314.247888 757.825232h121.813599" fill="#FFFFFF" p-id="2583"></path><path d="M436.061487 800.367816h-121.813599a42.542584 42.542584 0 1 1 0-85.085168h121.813599a42.542584 42.542584 0 0 1 0 85.085168z" fill="#888888" p-id="2584"></path><path d="M375.083783 301.626921v411.24498" fill="#FFFFFF" p-id="2585"></path><path d="M375.083783 755.414486a42.542584 42.542584 0 0 1-42.542584-42.542585v-411.24498a42.542584 42.542584 0 0 1 85.085169 0v411.24498a42.542584 42.542584 0 0 1-42.542585 42.542585z" fill="#888888" p-id="2586"></path></svg>' // 可选
        this.tag = 'button'
    }

    // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
    getValue(editor) {                              // JS 语法
        return ' hello '
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
        if (this.isDisabled(editor)) return
        editor.dangerouslyInsertHtml(`<span class="input">[input]</span>`);
    }
};

export default YinlvInput;