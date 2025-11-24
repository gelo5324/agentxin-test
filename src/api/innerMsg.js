import request from "@/utils/request.js";
import { getCacheData } from "./ab-cache";
import { orgPrefix } from "./api-prefix"

const servicePrefix = "/api/ab-bpm/cms/cmsInnerMsg";
const bpmServicePrefix = "/api/ab-bpm/bpm";
const sysServicePrefix = "/api/ab-bpm/sys";

// 消息 列表接口
export const cmsInnerMsgListUrl = servicePrefix + "/listJson";
// 消息 get详情接口
export const cmsInnerMsgGetUrl = servicePrefix + "/get?id=";
// 消息 删除接口
export const cmsInnerMsgRemoveUrl = servicePrefix + "/remove?id=";
// 消息 请求公告/待办数据（首页公告小组件）
export function cmsInnerAllDetails(type, currentPage, pageSize) {
  return request.post(servicePrefix + "/getAllDetails", {
    pageSize: pageSize,
    currentPage: currentPage,
    type: type,
  });
}

// 消息 修改状态接口(未读改为已读)
export function cmsupdateReadFn(id) {
  return request.get(servicePrefix + "/updateRead?id=" + id);
}

// 消息 修改状态接口(未读改为已读)
export function cmsupdateReadByIdsFn(ids) {
  return request.post(servicePrefix + "/updateRead", ids);
}
export function bpmMydefinitionListUrl(param) {
  return request.post(`${bpmServicePrefix}/my/definitionList`, {
    pageSize: 500,
    currentPage: 1,
    queryParam: param,
  });
}
export function getDictListByCode(dictCode) {
  const cacheCode = `getDictListByCode_${dictCode}}`;
  return getCacheData(cacheCode, async () => {
    return Promise.resolve({
      then: function (resolve, reject) {
        if (!dictCode) {
          resolve();
        }
        //如果数据为空， 或者数据中找不到此code 则赋值
        request
          .get(`${sysServicePrefix}/dataDict/getDictNodeList`, {
            dictKey: dictCode,
          })
          .then((rel) => {
            resolve(rel.data);
          });
      },
    });
  });
}

export function getContact(params) {
  return request.get(`${orgPrefix}/boot/contact/page`, params);
}
export function getDept() {
  return request.post(
    "/api/ab-bpm/biz/bizCustDialog/listSimpleData/addressBookOrganization",
    {
      pageSize: 10,
      currentPage: 1,
      queryParam: {
        name$VEQ: "",
      },
    }
  );
}

export function applyTaskList(currentPage) {
  return request.post("/api/ab-bpm/bpm/my/applyTaskList", {
    offset: 0,
    limit: 10,
    queryParam: {
      title$VLK: "",
      defKey$VEQ: "",
      "def.typeCode$VIN": "",
    },
    sortColumn: "",
    currentPage: currentPage||1,
    pageSize: 10,
    sortOrder: "",
  });
}
export function todoTaskList(currentPage) {
  return request.post("/api/ab-bpm/bpm/my/todoTaskList", {
    pageSize: 10,
    currentPage: currentPage||1,
    queryParam: {},
  });
}

export function approveList(currentPage) {
  return request.post("/api/ab-bpm/bpm/my/approveList", {
    pageSize: 10,
    currentPage: currentPage||1,
    queryParam: {},
  });
}

export function receiveList(currentPage) {
  return request.post("/api/ab-bpm/bpm/carbonCopy/receiveList", {
    pageSize: 10,
    currentPage: currentPage||1,
    queryParam: {},
  });
}
