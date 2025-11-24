import request from '@/utils/request.js'
import { orgPrefix } from './api-prefix'

export function GetToolsData(params) {
    const { userId } = params
    return request.get(`${orgPrefix}/usertools/getUserTools?id=${userId}`);
}

export function GetPortletDatas(params) {
    return request.get('/systest/sys/news/sys_news_main/sysNewsMainPortlet.do', {
        method: 'getNewsMportal',
        cateid: '182a6a695db6559239a4df54238b9517',
        rowsize: 3,
        type: 'pic',
        scope: 'no',
        ...params
    });
}

export function GetSSOUrl(params) {
    return request.get(`${orgPrefix}/auth/getAppUrl?identify=${params.id}`);
}
