import request from '@/utils/request'
/**
 * @name  销售情况统计
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function saleList(params) {
  return request({
    url: '/api/v1/admin/ss/sale/list',
    method: 'get',
    params,
  })
}

/**
 * @name  评价均分统计
 * @param {integer} current  页码
 * @param {integer} size     数量
 * @param {string}  startTime     开始时间
 * @param {string}  endTime       结束时间
 * @param {string} typeId        业务类型
 * @param {string} groupType     	排名类型
 */
export function scoreSs(params) {
  return request({
    url: '/api/v1/admin/ss/comment/scoreSs',
    method: 'get',
    params,
  })
}

/**
 * @name  评价排名列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 * @param {string}  startTime     开始时间
 * @param {string}  endTime       结束时间
 * @param {string} groupType     		分组类型
 */
export function rankinglist(params) {
  return request({
    url: '/api/v1/admin/ss/comment/rankinglist',
    method: 'get',
    params,
  })
}

/**
 * @name  评价导出
 */
export function exportData(params) {
  return request({
    url: '/api/v1/admin/ss/comment/exportData',
    method: 'get',
    params,
  })
}
