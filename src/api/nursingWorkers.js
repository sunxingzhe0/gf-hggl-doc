import request from '@/utils/request'
/* 护工分组层 **********************/
/**
 * @name  分组列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function getNspGroupList(params) {
  return request({
    url: '/api/v1/nurseGroup/getNspGroupList',
    method: 'get',
    params,
  })
}

/**
 * @name  全局分组列表[全局]
 */
export function chooseNurseGroup(params) {
  return request({
    url: '/api/v1/busConfig/chooseNurseGroup',
    method: 'get',
    params,
  })
}

/**
 * @name  新增分组
 * @param {string} groupName     分组名称
 */
export function addGroup(data) {
  return request({
    url: '/api/v1/nurseGroup/addGroup',
    method: 'post',
    data,
  })
}

/**
 * @name  删除分组
 * @param {string} id     主id
 */
export function delGroup(data) {
  return request({
    url: '/api/v1/nurseGroup/delGroup',
    method: 'post',
    data,
  })
}

/**
 * @name  修改分组名称,排序
 * @param {string} id     主id
 * @param {string} groupName     分组名
 * @param {Number} sortCode     序号
 */
export function editGroupInfo(data) {
  return request({
    url: '/api/v1/nurseGroup/editGroupInfo',
    method: 'post',
    data,
  })
}

/**
 * @name  修改分组状态
 * @param {string} id     主id
 * @param {Number} state     状态（0禁用 1启用）
 */
export function editGroupState(data) {
  return request({
    url: '/api/v1/nurseGroup/editGroupState',
    method: 'post',
    data,
  })
}

/**
 * @name  分组排班信息顶部基础信息
 * @param {string} id     主id
 */
export function getScheduleTopInfo(params) {
  return request({
    url: '/api/v1/nurseGroup/getScheduleTopInfo',
    method: 'get',
    params,
  })
}

/**
 * @name  分组排班信息底部业务信息
 * @param {string} date     时间（年月）
 * @param {string} id     主id
 */
export function getScheduleDayInfo(data) {
  return request({
    url: '/api/v1/nurseGroup/getScheduleDayInfo',
    method: 'post',
    data,
  })
}

/**
 * @name  获取单日排班时段价格信息
 * @param {string} date     时间（年月日）
 * @param {string} id     主id
 */
export function getDayTimePriceInfo(params) {
  return request({
    url: '/api/v1/nurseGroup/getDayTimePriceInfo',
    method: 'get',
    params,
  })
}

/* 护工管理层 **********************/
/**
 * @name  分组列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function workerList(params) {
  return request({
    url: '/api/v1/worker/list',
    method: 'get',
    params,
  })
}

/**
 * @name  新增护工
 *
 */
export function workerAdd(data) {
  return request({
    url: '/api/v1/worker/add',
    method: 'post',
    data,
  })
}

/**
 * @name  变更账号业务状态
 */
export function changeBizStatus(data) {
  return request({
    url: '/api/v1/worker/changeBizStatus',
    method: 'post',
    data,
  })
}

/**
 * @name  变更账号启用状态
 */
export function changeStatus(data) {
  return request({
    url: '/api/v1/worker/changeStatus',
    method: 'post',
    data,
  })
}

/**
 * @name  删除账号
 */
export function workerDelete(data) {
  return request({
    url: '/api/v1/worker/delete',
    method: 'post',
    data,
  })
}

/**
 * @name  编辑账号
 */
export function workerEdit(data) {
  return request({
    url: '/api/v1/worker/edit',
    method: 'post',
    data,
  })
}

/**
 * @name  护工排班信息
 * @param {Array} busIds  业务id集合(护工详情传入)
 * @param {string} date  	日期 (格式 yyyy-MM)
 * @param {string} id  	护工id
 *
 */
export function getNurseScheduleBus(data) {
  return request({
    url: '/api/v1/schedule/getNurseScheduleBus',
    method: 'post',
    data,
  })
}

/**
 * @name  护工每日排班时段价格信息
 * @param {string} date  	日期 (格式 yyyy-MM-dd)
 * @param {string} nurseId  	护工id
 */
export function getNurseScheDayInfo(params) {
  return request({
    url: '/api/v1/schedule/getNurseScheDayInfo',
    method: 'GET',
    params,
  })
}

/**
 * @name  新增排班时段价格信息
 * @param {string} busId  	业务id
 * @param {string} busName  	业务名称
 * @param {string} price  	价格
 * @param {string} date  	时间（YYYY-MM-DD'）
 * @param {string} nurseId  	护工id
 * @param {string} ruleRelId  	当前新增的时段ID
 */
export function addNurseBus(data) {
  return request({
    url: '/api/v1/schedule/addNurseBus',
    method: 'post',
    data,
  })
}

/**
 * @name  移除排班时段价格信息
 * @param {string} date  	时间（YYYY-MM-DD'）
 * @param {string} nurseId  	护工id
 * @param {array} scheduleIds  	时段排班id集合(移除单个时传相应的id,移除全部传全部的id)
 */
export function delNurseBus(data) {
  return request({
    url: '/api/v1/schedule/delNurseBus',
    method: 'post',
    data,
  })
}

/**
 * @name  预约排期信息
 * @param {Array} busIds  业务id集合(护工详情传入)
 * @param {string} date  	日期 (格式 yyyy-MM)
 * @param {string} id  	护工id
 *
 */
export function getOrderSchInfo(data) {
  return request({
    url: '/api/v1/schedule/getOrderSchInfo',
    method: 'post',
    data,
  })
}

/**
 * @name  单日预约排期信息
 * @param {string} date  	日期 ((格式 yyyy-MM-dd)
 * @param {string} nurseId  	护工id
 *
 */
export function getDayOrderInfo(params) {
  return request({
    url: '/api/v1/schedule/getDayOrderInfo',
    method: 'get',
    params,
  })
}

/**
 * @name  工单列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function workorderList(params) {
  return request({
    url: '/api/v1/admin/workorder/list',
    method: 'get',
    params,
  })
}

/**
 * @name  用户评价列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function commentList(params) {
  return request({
    url: '/api/v1/admin/comment/list',
    method: 'get',
    params,
  })
}

/* 工况统计层******************************** */
/**
 * @name  工况统计列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function workCountList(params) {
  return request({
    url: '/api/v1/workCount/workCountList',
    method: 'get',
    params,
  })
}

/* 排班管理层******************************** */
/**
 * @name  排班列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function scheduleList(params) {
  return request({
    url: '/api/v1/schedule/scheduleList',
    method: 'get',
    params,
  })
}

/**
 * @name  列表发布排班
 * @param {string} code  编号
 */
export function releaseSchedule(data) {
  return request({
    url: '/api/v1/schedule/releaseSchedule',
    method: 'post',
    data,
  })
}

/**
 * @name  删除排班
 * @param {string} code  编号
 */
export function delSchedule(data) {
  return request({
    url: '/api/v1/schedule/delSchedule',
    method: 'post',
    data,
  })
}

/**
 * @name  查询时段信息
 */
export function getTimeInfo(params) {
  return request({
    url: '/api/v1/schedule/getTimeInfo',
    method: 'get',
    params,
  })
}

/**
 * @name  保存-发布排班
 */
export function addSchedule(data) {
  return request({
    url: '/api/v1/schedule/addSchedule',
    method: 'post',
    data,
  })
}

/**
 * @name  编辑排班回显排班详情
 */
export function backScheduleInfo(params) {
  return request({
    url: '/api/v1/schedule/backScheduleInfo',
    method: 'get',
    params,
  })
}

/**
 * @name  排班详情护工分组
 */
export function getGroupInfo(params) {
  return request({
    url: '/api/v1/schedule/getGroupInfo',
    method: 'get',
    params,
  })
}

/* 时段规则层******************************** */
/**
 * @name  时段规则列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function timeRuleList(params) {
  return request({
    url: '/api/v1/timeRule/timeRuleList',
    method: 'get',
    params,
  })
}

/**
 * @name  时段规则状态改变
 * @param {string} id  主id
 * @param {string} state     状态（0禁用 1启用）
 */
export function editState(data) {
  return request({
    url: '/api/v1/timeRule/editState',
    method: 'post',
    data,
  })
}

/**
 * @name  删除时段规则
 * @param {string} id  主id
 */
export function delTimeRule(data) {
  return request({
    url: '/api/v1/timeRule/delTimeRule',
    method: 'post',
    data,
  })
}

/**
 * @name  新增时段规则
 * @param {string} id  主id
 */
export function addTimeRule(data) {
  return request({
    url: '/api/v1/timeRule/addTimeRule',
    method: 'post',
    data,
  })
}

/**
 * @name  根据主键id查询时段规则详情
 * @param {string} id  主id
 */
export function getRuleInfoById(params) {
  return request({
    url: '/api/v1/timeRule/getRuleInfoById',
    method: 'get',
    params,
  })
}

/**
 * @name  时段规则使用详情列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function ruleUsedList(params) {
  return request({
    url: '/api/v1/timeRule/ruleUsedList',
    method: 'get',
    params,
  })
}
