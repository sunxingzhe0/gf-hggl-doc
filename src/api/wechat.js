import request from '@/utils/request'
/**
 * @name  微信用户列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function wechatList(params) {
  return request({
    url: '/api/v1/wxuser/list',
    method: 'get',
    params,
  })
}
