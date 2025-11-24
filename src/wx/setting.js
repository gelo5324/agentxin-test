/**
 * @description 企微配置
 *
 */

export const wx = {
    // 当前用户企业所属企业ID
    corpId: import.meta.env?.VITE_CORPID,
    // 当前应用的AgentID
    agentId: import.meta.env?.VITE_AGENTID,
    jsApiList: ['openDefaultBrowser','closeWindow']
};
  
export default wx;