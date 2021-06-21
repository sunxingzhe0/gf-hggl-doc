import request from '@/utils/request'
/* 对账管理层 **********************/
/**
 * @name  金额柱状图统计
 * @param {string} type  账单类型
 * @param {string} startTime     开始时间
 * @param {string} endTime     结束时间
 */
export function priceSs(params) {
  return request({
    url: '/api/v1/admin/bill/priceSs',
    method: 'get',
    params,
  })
}

/**
 * @name  支付金额饼图统计
 * @param {string} type  账单类型
 * @param {string} startTime     开始时间
 * @param {string} endTime     结束时间
 */
export function payPricePp(params) {
  return request({
    url: '/api/v1/admin/bill/payPricePp',
    method: 'get',
    params,
  })
}

/**
 * @name  账单列表
 * @param {Number} size  单页数量
 * @param {Number} current  查询页
 * @param {string} type  账单类型
 * @param {string} startTime     开始时间
 * @param {string} endTime     结束时间
 */
export function billList(params) {
  return request({
    url: '/api/v1/admin/bill/list',
    method: 'get',
    params,
  })
}

/**
 * @name  账单导出
 */
export function exportData(params) {
  return request({
    url: '/api/v1/admin/bill/exportData',
    method: 'get',
    params,
  })
}
