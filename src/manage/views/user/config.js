import { GetList, DeleteData } from "./api";
export default {
    api: {
        get: GetList,
        delete: DeleteData
    },
    filterItems: [
        {
            component: 'el-input',
            label: '',
            prop: 'name',
            attributes: {
                placeholder: '请输入姓名查询'
            },
            style: {
                width: "140px",
            }
        },
        {
            component: 'el-input',
            label: '',
            prop: 'account',
            attributes: {
                placeholder: '请输入账号查询'
            },
            style: {
                width: "140px",
            }
        },
        {
            component: 'el-input',
            label: '',
            prop: 'phone',
            attributes: {
                placeholder: '请输入手机号查询'
            },
            style: {
                width: "140px",
            }
        },
        {
            component: "el-select",
            prop: "campus",
            defaultVal: [],
            child: {
            component: 'el-option',
            options: [{
                    label: '请假申请',
                    value: 1
                },
                {
                    label: '出差申请',
                    value: 2
                },
                {
                    label: '市内公出',
                    value: 3
                },
                {
                    label: '未打卡说明',
                    value: 4
                },
                {
                    label: '我的信息',
                    value: 5
                },
                {
                    label: '我的资产',
                    value: 6
                },
                {
                    label: '我的票据',
                    value: 7
                },
                {
                  label: '知识中心',
                  value: 8
                },
                {
                  label: '我的发起',
                  value: 9
                },
                {
                  label: '我的草稿',
                  value: 10
                }]
            },
            attributes: {
                multiple: true,
                collapseTags: true,
                placeholder: '请选择常用工具'
            },
            style: {
                width: "140px",
            }
        }
    ],
    operaBtns: [
        {
            label: '导入',
            type: 'primary',
            disabled: false,
            loading: false,
            eventName: 'add'
        },
        {
            label: '导出',
            disabled: false,
            loading: false,
            eventName: 'export'
        }
    ],
    filterBtns: [{
        label: '查询',
        type: 'primary',
        disabled: false,
        loading: false,
        eventName: 'inquire'
    },
    {
        label: '重置',
        loading: false,
        eventName: 'reset'
    }],
    colItems: [
        {
            prop: 'serialNo',
            label: '序号',
            width: '60',
            align: 'center'
        },
        {
            prop: 'name',
            label: '姓名'
        },
        {
            prop: 'account',
            label: '账号'
        },
        {
            prop: 'phone',
            label: '手机号'
        },
        {
            prop: 'postName',
            label: '岗位'
        },
        {
            label: '操作',
            width: '60px',
            operate: [
                {
                    label: '权限',
                    eventName: 'edit',
                    type: 'text',
                    loading: false,
                    disabled: false,
                    size: 'small'
                },
                // {
                //     label: '查看',
                //     eventName: 'look',
                //     type: 'text',
                //     loading: false,
                //     disabled: false,
                //     size: 'small'
                // }
            ]
        }
    ]
}