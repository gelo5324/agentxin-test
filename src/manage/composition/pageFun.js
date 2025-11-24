import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
const filterConfig = {
    size: 'small',
    labelWidth: '0px',
    labelPosition: 'left',
    inline: true,
    hideRequiredAsterisk: true,
    showMessage: false
}

const popConfig = {
    title: '',
    width: '600px',
    appendToBody: true,
    showClose: true,
    detailField: ''
}

export default function (PageConfig,events) {
    const route = useRoute();
    const router = useRouter();
    const PageApi = PageConfig.api;
    const fromProps = ref(PageConfig.filterConfig || filterConfig);
    const filterItems = ref(PageConfig.filterItems || []);
    const filterBtns = ref(PageConfig.filterBtns || []);
    const operaItems = reactive([]);
    const operaBtns = ref(PageConfig.operaBtns || []);
    const colItems = ref(PageConfig.colItems || []);
    let _filterParams = {};
    filterItems.value.forEach((item) => {
        if (item.prop) _filterParams[item.prop] = item.val || "";
    });
    let filterParams = ref(_filterParams);

    const pageHandler = {
        sizeChange: (cur) => {
            params.current = 1;
            params.size = cur;
            getDatas();
        },
        currentChange: (cur) => {
            params.current = cur;
            getDatas();
        },
    };

    const total = ref(0);
    const params = reactive({
        current: 1,
        size: 20,
    });
    const routeQuery = route.query;
    const routeParams = route.params;
    for(let i in routeParams) params[i]=routeParams[i];

    const tableData = ref([]);
    const tableSelect = ref([]);
    const tableEventHander = {
        selectionChange: (cur) => {
            tableSelect.value = cur;
        },
        rowClick: (row, column, event) => { },
    };

    // 表格列操作事件(编辑/删除/...)
    const operateEvent = ({ btn, data }) => {
        if (!btn.eventName) return;
        eventHander(btn.eventName, btn, data);
    };

    const requestAwait = ref(false);
    // 获取table数据
    const getDatas =() => {
        if (!PageApi.get) return;
        if (requestAwait.value) return;
        requestAwait.value = true;
        tableData.value = [];
        total.value = 0;
        PageApi.get({
            ...params,
            ...filterParams.value
        })
            .then((res) => {
                let result
                if (!res.records) {
                    result = {
                        records: res,
                        total: res.length
                    }
                } else {
                    result =res
                }
                total.value = result.total;
                if (result.records) result.records.forEach((item, index) => {
                    let no = ((params.current-1)*params.size)+(index+1);
                    item.serialNo = no<10?`0${no}`:`${no}`
                })
                tableData.value = result.records;
            })
            .finally(() => {
                requestAwait.value = false;
            });
    };

    const filterChangeHandler = () => {
        // pageHandler.currentChange(1);
    };

    const popProps = ref(popConfig);

    const dialogVisible = ref(0);
    const dialogHandler = {
        close: () => {
            dialogVisible.value = 0;
        },
        addSuccess: (data) => {
            dialogVisible.value = 0;
            pageHandler.currentChange(1);
        },
    };

    const drawerVisible = ref(0);
    const drawerHandler = {
        close: () => {
            drawerVisible.value = 0;
        }
    };

    const editInfo = ref(null);
    const eventHander = async (name, btn, info) => {
        editInfo.value = null;
        if (info) editInfo.value = info;
        if (!name) return;
        if (events&&events[name]) {
            events[name](editInfo.value)
            return
        }
        switch (name) {
            case "inquire":
                pageHandler.currentChange(1);
                break;
            case "reset":
                for (var i in filterParams.value) filterParams.value[i] = "";
                pageHandler.currentChange(1);
                break;
            case "add":
                dialogVisible.value = 1;
                break;
            case "edit":
                dialogVisible.value = 2;
                break;
            case "delete":
                deleteDatas(btn);
                break;
            case "drawer":
                drawerVisible.value = 1;
                break;
            case "goPage":
                if (btn.pageUrl) {
                    let url = btn.pageUrl.split('/:');
                    let resUrl = `/${url[0]}`
                    for(let i=0,len=url.length;i<len;i++) {
                        if (i===0) continue
                        resUrl = `${resUrl}/${info[url[i]]||info['id']}`
                    }
                    router.push(`${resUrl}`);
                }
                break;
            default:
                break;
        }
    };

    // 删除操作
    const deleteDatas = (btn) => {
        if (requestAwait.value) return;
        if (!editInfo.value && tableSelect.value.length <= 0) {
            ElMessage({
                message: "请至少选中一条数据删除",
                type: "warning",
            });
            return;
        }
        ElMessageBox.confirm("确认删除?", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
        }).then(() => {
            requestAwait.value = true;
            if (!editInfo.value) btn.loading = true;
            PageApi.delete({
                ids: editInfo.value.id
            })
                .then((res) => {
                    ElMessage({
                        message: "删除成功.",
                        type: "success",
                    });
                })
                .finally(() => {
                    requestAwait.value = false;
                    btn.loading = false;
                    getDatas();
                });
        });
    };
    return {
        route,
        router,
        requestAwait,
        fromProps,
        filterItems,
        filterBtns,
        operaItems,
        operaBtns,
        colItems,
        routeParams,
        routeQuery,
        filterParams,
        params,
        total,
        tableData,
        pageHandler,
        tableEventHander,
        dialogVisible,
        dialogHandler,
        drawerVisible,
        drawerHandler,
        editInfo,
        popProps,
        eventHander,
        filterChangeHandler,
        operateEvent,
        getDatas,
        deleteDatas
    }
}