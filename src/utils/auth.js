import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const zytokenkey = 'zy-token'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getzyToken() {
  return Cookies.get(zytokenkey)
}

export function setzyToken(token) {
  return Cookies.set(zytokenkey, token)
}

export function removezyToken() {
  return Cookies.remove(zytokenkey)
}

//菜单树
export function setMenuTree(menuTree) {
  console.log(123)
  return Cookies.set('setMenuTree', menuTree)
}

export function getMenuTree() {
  return Cookies.get('getMenuTree')
}
export function removeMenuTree() {
  return Cookies.remove('removeMenuTree')
}
