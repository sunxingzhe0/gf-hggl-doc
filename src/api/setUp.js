import request from '@/utils/request'
/* 账号管理层 **********************/
/**
 * @name  账号列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function accountList(params) {
  return request({
    url: '/api/v1/account/list',
    method: 'get',
    params,
  })
}

/**
 * @name  新增账号
 * @param {string} account  账号名称
 * @param {Array} roleList  角色id集合
 * @param {string} pwd  密码
 * @param {Number} status  状态（1启用 0禁用）
 */
export function addAccount(data) {
  return request({
    url: '/api/v1/account/add',
    method: 'post',
    data,
  })
}

/**
 * @name  删除账号
 * @param {string} id  账号id
 */
export function delAccount(data) {
  return request({
    url: '/api/v1/account/delete',
    method: 'post',
    data,
  })
}

/**
 * @name  编辑账号
 * @param {string} id  账号id
 * @param {string} account  账号名称
 * @param {Array} roleList  角色id集合
 * @param {string} pwd  密码
 * @param {Number} status  状态（1启用 0禁用）
 */
export function editAccount(data) {
  return request({
    url: '/api/v1/account/edit',
    method: 'post',
    data,
  })
}

/**
 * @name  变更账号状态
 * @param {string} id  账号id
 * @param {Number} status  状态（1启用 0禁用）
 */
export function changeAccountStatus(data) {
  return request({
    url: '/api/v1/account/changeStatus',
    method: 'post',
    data,
  })
}

/* 角色管理层 ****************************/
/**
 * @name  角色列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function roleList(params) {
  return request({
    url: '/api/v1/role/list',
    method: 'get',
    params,
  })
}

/**
 * @name  新增角色
 * @param {Array} accessCodes  权限标识集合
 * @param {string} name  角色名
 * @param {Number} status  状态（1启用 0禁用）
 */
export function addRole(data) {
  return request({
    url: '/api/v1/role/add',
    method: 'post',
    data,
  })
}

/**
 * @name  变更角色状态
 * @param {string} id  角色id
 * @param {Number} status  状态（1启用 0禁用）
 */
export function changeStatus(data) {
  return request({
    url: '/api/v1/role/changeStatus',
    method: 'post',
    data,
  })
}

/**
 * @name  删除角色
 * @param {string} id  角色id
 */
export function delRole(data) {
  return request({
    url: '/api/v1/role/delete',
    method: 'post',
    data,
  })
}

/**
 * @name  编辑角色
 * @param {Array} accessCodes  权限标识集合
 * @param {string} id  角色id
 * @param {string} name  角色名
 * @param {Number} status  状态（1启用 0禁用）
 */
export function editRole(data) {
  return request({
    url: '/api/v1/role/edit',
    method: 'post',
    data,
  })
}

/* 业务管理层 ***********************/
/**
 * @name  业务管理列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function getBusList(params) {
  return request({
    url: '/api/v1/busConfig/getBusList',
    method: 'get',
    params,
  })
}

/**
 * @name  新增业务
 * @param {string} busName     业务名称
 * @param {string} busDesc     业务描述
 */
export function addBusConfig(data) {
  return request({
    url: '/api/v1/busConfig/addBusConfig',
    method: 'post',
    data,
  })
}

/**
 * @name  全局业务选项（全局）
 */
export function bizList(params) {
  return request({
    url: '/api/v1/busConfig/bizList',
    method: 'get',
    params,
  })
}

/**
 * @name  删除业务
 * @param {string} id     业务id
 */
export function delBusConfig(data) {
  return request({
    url: '/api/v1/busConfig/delBusConfig',
    method: 'post',
    data,
  })
}

/**
 * @name  修改业务名称,描述,排序
 * @param {string} id     业务id
 * @param {string} busName     业务名
 * @param {Number} sortCode    排序编号
 */
export function editBusInfo(data) {
  return request({
    url: '/api/v1/busConfig/editBusInfo',
    method: 'post',
    data,
  })
}

/**
 * @name  修改业务状态
 * @param {string} id     业务id
 * @param {Number} state     状态（0禁用，1启用）
 */
export function editBusState(data) {
  return request({
    url: '/api/v1/busConfig/editBusState',
    method: 'post',
    data,
  })
}

/* 系统消息层 ***************************/

/**
 * @name  系统消息列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function msgList(params) {
  return request({
    url: '/api/v1/notice/list',
    method: 'get',
    params,
  })
}

/**
 * @name  变更已读状态
 * @param {string} id
 */
export function changeReaded(params) {
  return request({
    url: '/api/v1/notice/get',
    method: 'get',
    params,
  })
}

/**
 * @name  一键已读
 * @param {Array}} ids
 */
export function changeReadedAll(data) {
  return request({
    url: '/api/v1/notice/changeReaded',
    method: 'post',
    data,
  })
}

/**
 * @name  删除消息
 * @param {string} id
 */
export function deleteMsg(data) {
  return request({
    url: '/api/v1/notice/delete',
    method: 'post',
    data,
  })
}

/* 轮播图层************************ */
/**
 * @name  轮播图列表
 * @param {integer} current  页码
 * @param {integer} size     数量
 */
export function imgList(params) {
  return request({
    url: '/api/v1/slideshow/list',
    method: 'get',
    params,
  })
}

/**
 * @name  新增轮播图
 * @param {string} imageId    图片id（来源于上传接口返回，图片上传接口在index接口列表）
 * @param {string} sort       排序标识
 * @param {number} status     状态（1显示 2隐藏）
 */
export function imgAdd(data) {
  return request({
    url: '/api/v1/slideshow/add',
    method: 'post',
    data,
  })
}

/**
 * @name  变更轮播图排序
 * @param {string} id         主键id
 * @param {string} sort     排序标识
 */
export function imgChangeSort(data) {
  return request({
    url: '/api/v1/slideshow/changeSort',
    method: 'post',
    data,
  })
}

/**
 * @name  变更轮播图启用状态
 * @param {Array} ids         主键id集合
 * @param {number} status     状态（1显示 2隐藏）
 */
export function imgChangeStatus(data) {
  return request({
    url: '/api/v1/slideshow/changeStatus',
    method: 'post',
    data,
  })
}

/**
 * @name  删除轮播图
 * @param {Array} ids     主id合集
 */
export function imgDelete(data) {
  return request({
    url: '/api/v1/slideshow/delete',
    method: 'post',
    data,
  })
}

/**
 * @name  编辑轮播图
 * @param {string} id         主键id
 * @param {string} imageId    图片id（来源于上传接口返回，图片上传接口在index接口列表）
 * @param {string} sort       排序标识
 * @param {number} status     状态（1显示 2隐藏）
 */
export function imgEdit(data) {
  return request({
    url: '/api/v1/slideshow/edit',
    method: 'post',
    data,
  })
}

/* 个人信息层**************************** */
/**
 * @name  验证密码
 * @param {string} oldPassword         旧密码
 */
export function validatePassword(params) {
  return request({
    url: '/api/v1/login/web/validatePassword',
    method: 'get',
    params,
  })
}

/**
 * @name  验证密码
 * @param {string} account         用户账号
 * @param {string} oldPassword         旧密码
 * @param {string} newPassword         	新密码
 */
export function changePassword(data) {
  return request({
    url: '/api/v1/login/web/changePassword',
    method: 'post',
    data,
  })
}
