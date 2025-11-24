import request from '@/utils/request.js'
import { orgPrefix, bpmPrefix } from './api-prefix'
import { getOaToken } from '@/utils/accessToken';
import { GetXinspace } from '@/utils/index'

export function GetEntrance(params) {
  return request.get('/portalapi/blade-auth/captcha', params);
}

export function GetMyEntrance(params) {
  return request.get(`${orgPrefix}/boot/quickAccess/getQuickAccess`, params);
}

export function EditMyEntrance(params) {
  return request.post(`${orgPrefix}/boot/quickAccess/saveQuickAccess`, params)
}

export function GetNewsDatas(params) {
  const oaToken = getOaToken()
  if (!oaToken||oaToken==='null') return Promise.reject()
  return request.get('/systest/sys/common/dataxml.jsp', {
    s_bean: 'sysNewsMainPortletService',
    rowsize: 8,
    type: 'main',
    scope: 'no',
    f_s: 'sourcejs',
    t: new Date().getTime(),
    ...params
  });
}

export function GetTodoDatas(params) {
  const oaToken = getOaToken()
  if (!oaToken||oaToken==='null') return Promise.reject()
  return request.get('/systest/sys/notify/sys_notify_todo/sysNotifyMainIndex.do', {
    method: 'list',
    dataType: 'todo',
    fdType: 13,
    fdCateId: '',
    'q.j_path': '/process',
    'q.dataType': 'todo',
    orderby: 'fdCreateTime',
    ordertype: 'down',
    __seq: new Date().getTime(),
    ...params
  });
}

export function GetKmDatas(params) {
  const oaToken = getOaToken()
  if (!oaToken||oaToken==='null') return Promise.reject()
  return request.get('/systest/km/review/km_review_index/kmReviewIndex.do', {
    method: 'list',
    pagingSetting: '',
    'q.mydoc': 'create',
    'q.j_path': '/FlistCreate',
    orderby: 'docCreateTime',
    ordertype: 'down',
    __seq: new Date().getTime(),
    ...params
  });
}

export function GetStudyUrl(params) {
  return request.get(`${orgPrefix}/auth/yunxuetangLoginUrl`, params);
}

export function GetNotify(params) {
  const oaToken = getOaToken()
  if (!oaToken||oaToken==='null') return Promise.reject()
  return request.get('/systest/sys/notify/sys_notify_todo/sysNotifyTodo.do', params);
}

export function GetFlowNum(params) {
  const oaToken = getOaToken()
  if (!oaToken||oaToken==='null') return Promise.reject()
  return request.get('/systest/km/review/km_review_main/kmReviewMain.do', params);
}

export function GetBusinessTravelUrl(params) {
  return request.get(`${orgPrefix}/auth/shnaglvLoginUrl/0`, params);
}

export function GetMobileBusinessTravelUrl(params) {
  return request.get(`${orgPrefix}/auth/shnaglvLoginUrl/1`, params);
}

export function GetBannerData() {
  return request.post(`${bpmPrefix}/biz/bizCustGrid/view/list_xinportal_index_banner_view`, {
    currentPage: 1,
    pageSize: 10,
    orderBy: '',
    queryData: [
      {
        "name": "is_del_",
        "con": "=",
        "val": "0"
      },
      {
        "name": "status_",
        "con": "=",
        "val": "1"
      }
    ]
  })
}

// 单点
export function GetFeiyongUrl(params) {
  return request.get(`${orgPrefix}/auth/feiYongLoginUrl`);
}

export function GetHrUrl(params) {
  return request.get(`${orgPrefix}/auth/hrLoginUrl`);
}

export function GetDubanUrl(params) {
  return request.get(`${orgPrefix}/auth/duBanLoginUrl`);
}

export function GetErpUrl(params) {
  return request.get(`${orgPrefix}/auth/erpLoginUrl`);
}

export function XinspaceLoginLog() {
  return request.get(`${GetXinspace()}/api/ab-totalassets/assets/log/loginXinSpace`);
}