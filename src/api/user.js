import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/v1/login/web/webLogin',
    method: 'post',
    data,
  })
}

export function getInfo(token) {
  return request({
    url: '/api/v1/login/loginInfo',
    method: 'get',
    data: { token },
  })
}

export function logout() {
  return request({
    url: '/api/v1/login/logOut',
    method: 'get',
  })
}
