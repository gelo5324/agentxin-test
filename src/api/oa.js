import request from '@/utils/request.js'

export function LanLingCookie(params) {
    return request.get('/portalapi/blade-auth/lanlingCookie', params);
}