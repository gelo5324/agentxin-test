import request from '@/utils/request';
import { DownloadExcel } from '@/utils/utils'

// 列表
export function GetList(params) {
    const {current,size} = params
    return request.post(`/portalapi/blade-user/listpage?current=${current}&size=${size}`, {
        ...params
    });
}

// 添加
export function AddData(params) {
    return request.post('/portalapi', {
        ...params
    });
}

// 编辑权限
export function EditData(params) {
    return request.post('/portalapi/blade-user/grantCampus', {
        ...params
    });
}

// 删除
export function DeleteData(params) {
    return request.get('/portalapi', {
        ...params
    });
}

// 用户权限导出
export async function DownUser(params) {
    return DownloadExcel('/portalapi/blade-user/export-user-auth','用户权限数据','POST',params)
}

// 模板导出
export async function DownTemplate() {
    return DownloadExcel('/portalapi/blade-user/export-template-auth','模板')
}

// 模板导入
export function ImportUrl() {
    return '/portalapi/blade-user/import-user-auth'
}