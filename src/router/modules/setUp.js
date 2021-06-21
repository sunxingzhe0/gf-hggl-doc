/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/setUp',
  component: Layout,
  redirect: '/setUp',
  name: 'setUp',
  alwaysShow: true,
  meta: {
    title: '设置',
    icon: 'sidebar-set-up',
    roles: 'SETTING_INFO',
  },
  children: [
    {
      path: 'userInfo',
      component: () => import('@/views/setUp/userInfo'),
      name: 'userInfo',
      meta: {
        title: '个人信息',
        roles: 'SETTING_INFO',
      },
    },
    {
      path: 'accountSet',
      component: () => import('@/views/setUp/accountSet'),
      name: 'accountSet',
      meta: {
        title: '账号管理',
        roles: 'SETTING_ACCOUNT',
      },
    },
    {
      path: 'roleSet',
      component: RouterView,
      name: 'roleSet',
      meta: {
        title: '角色管理',
        roles: 'SETTING_ROLE',
      },
      redirect: '/setUp/roleSet/roleList',
      children: [
        {
          path: 'roleList',
          component: () => import('@/views/setUp/roleSet/roleList'),
          meta: { activeMenu: '/setUp/roleSet' },
          hidden: true,
        },
        {
          path: 'editRole',
          component: () => import('@/views/setUp/roleSet/editRole'),
          meta: { title: '编辑角色', activeMenu: '/setUp/roleSet' },
          props: true,
          hidden: true,
        },
        {
          path: 'addRole',
          component: () => import('@/views/setUp/roleSet/editRole'),
          meta: { title: '新增角色', activeMenu: '/setUp/roleSet' },
          props: true,
          hidden: true,
        },
      ],
    },
    {
      path: 'business',
      component: () => import('@/views/setUp/business'),
      name: 'business',
      meta: {
        title: '业务管理',
        roles: 'SETTING_BIS',
      },
    },
    {
      path: 'carousel',
      component: () => import('@/views/setUp/carousel'),
      name: 'carousel',
      meta: {
        title: '轮播图',
        roles: 'SETTING_CAROUSEL',
      },
    },
    {
      path: 'systemMsg',
      component: RouterView,
      name: 'systemMsg',
      meta: {
        title: '系统消息',
        roles: 'SETTING_MESSAGE',
      },
      redirect: '/setUp/systemMsg/list',
      children: [
        {
          path: 'list',
          component: () => import('@/views/setUp/systemMsg/list'),
          meta: { activeMenu: '/setUp/systemMsg' },
          props: true,
          hidden: true,
        },
        {
          path: 'msgDetail',
          component: () => import('@/views/setUp/systemMsg/msgDetail'),
          meta: { title: '详情', activeMenu: '/setUp/systemMsg' },
          props: true,
          hidden: true,
        },
      ],
    },
  ],
}
