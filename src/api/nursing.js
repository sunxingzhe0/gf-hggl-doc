import request from '@/utils/request'

/**
 * @name 预约单列表
 */
export function orderList(params) {
  return request({
    url: '/api/v1/admin/order/orderList',
    method: 'get',
    params,
  })
}

/**
 * @name 预约单详情
 */
export function orderInfo(orderId) {
  return request({
    url: `/api/v1/admin/order/${orderId}`,
    method: 'get',
  })
}

/**
 * @name 预约单售后申请
 */
export function aftermarket(data) {
  return request({
    url: `/api/v1/admin/order/aftermarket`,
    method: 'post',
    data,
  })
}

/**
 * @name 审核同意
 */
export function confirm(data) {
  return request({
    url: `/api/v1/admin/order/confirm`,
    method: 'post',
    data,
  })
}

/**
 * @name 审核拒绝
 */
export function refuse(data) {
  return request({
    url: `/api/v1/admin/order/refuse`,
    method: 'post',
    data,
  })
}

// **************护理任务****************
/**
 * @name 护理任务列表
 */
export function taskList(params) {
  return request({
    url: '/api/v1/admin/task/taskList',
    method: 'get',
    params,
  })
}
/**
 * @name 获取护理任务详情
 */
export function taskInfo(orderId) {
  return request({
    url: `/api/v1/admin/task/${orderId}`,
    method: 'get',
  })
}
/**
 * @name 添加任务
 */
export function addTask(data) {
  return request({
    url: '/api/v1/admin/task/add',
    method: 'post',
    data,
  })
}
/**
 * @name 预约护工排班时段价格详情
 */
export function getNurseScheInfo(params) {
  return request({
    url: '/api/v1/schedule/getNurseScheInfo',
    method: 'get',
    params,
  })
}

/**
 * @name 工单列表
 */
export function workorderList(params) {
  return request({
    url: '/api/v1/admin/workorder/list',
    method: 'get',
    params,
  })
}

/**
 * @name 工单详情
 */
export function workorder(workId) {
  return request({
    url: `/api/v1/admin/workorder/${workId}`,
    method: 'get',
  })
}

/**
 * @name 终止工单
 */
export function workorderStop(workId) {
  return request({
    url: `/api/v1/admin/workorder/stop/${workId}`,
    method: 'post',
  })
}

/**
 * @name 修改护工-转工单
 */
export function changeEmployee(data) {
  return request({
    url: `/api/v1/admin/workorder/changeEmployee`,
    method: 'post',
    data,
  })
}

/**
 * @name 售后单列表
 */
export function aftermarketList(params) {
  return request({
    url: '/api/v1/admin/aftermarket/aftermarketList',
    method: 'get',
    params,
  })
}

/**
 * @name 评价列表
 */
export function commentList(params) {
  return request({
    url: '/api/v1/admin/comment/list',
    method: 'get',
    params,
  })
}

/**
 * @name 获取院内科室列表
 * @param {*} params
 * @returns
 */
export function getOrgDeptList(params) {
  return request({
    url: '/api/v1/org/getOrgDeptList',
    method: 'get',
    params,
  })
}

/**
 * @name 根据住院号获取患者基本信息
 * @param {*} params
 * @returns
 */
export function getPatientInfoByHospitalId(params) {
  return request({
    url: '/api/v1/org/getPatientInfoByHospitalId',
    method: 'get',
    params,
  })
}
