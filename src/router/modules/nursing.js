/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/nursing',
  component: Layout,
  redirect: '/nursing',
  name: 'nursing',
  alwaysShow: true,
  meta: {
    title: '护理',
    icon: 'sidebar-prescriptio',
    roles: 'NURSING_TASK',
  },
  children: [
    {
      path: 'task',
      component: RouterView,
      name: 'task',
      meta: {
        title: '任务管理',
        roles: 'NURSING_TASK',
      },
      redirect: '/nursing/task/list',
      children: [
        {
          path: 'list',
          component: () => import('@/views/nursing/task'),
          meta: { activeMenu: '/nursing/task' },
          hidden: true,
        },
        {
          path: 'add',
          component: () => import('@/views/nursing/task/editTask'),
          meta: { title: '新增任务', activeMenu: '/nursing/task' },
          hidden: true,
        },
        {
          path: 'edit',
          component: () => import('@/views/nursing/task/editTask'),
          meta: { title: '编辑任务', activeMenu: '/nursing/task' },
          hidden: true,
        },
        {
          path: 'taskInfo',
          component: () => import('@/views/nursing/task/taskInfo'),
          meta: { title: '任务详情', activeMenu: '/nursing/task' },
          hidden: true,
        },
      ],
    },
    {
      path: 'workOrder',
      component: RouterView,
      name: 'workOrder',
      meta: {
        title: '工单管理',
        roles: 'NURSING_WORK_ORDER',
      },
      children: [
        {
          path: '',
          component: () => import('@/views/nursing/workOrder'),
          name: '',
          meta: { title: '工单管理', roles: ['ORG_WEB_MECHANISM'] },
        },
        {
          path: 'info',
          component: () => import('@/views/nursing/workOrder/info'),
          name: 'info',
          meta: { activeMenu: '/nursing/workOrder' },
          hidden: true,
        },
      ],
    },
    {
      path: 'bookingForm',
      component: RouterView,
      name: 'bookingForm',
      meta: {
        title: '预约单',
        roles: 'NURSING_ORDER',
      },
      children: [
        {
          path: '',
          component: () => import('@/views/nursing/bookingForm'),
          name: '',
          meta: {
            title: '预约单',
            roles: ['ORG_WEB_MECHANISM'],
          },
        },
        {
          path: 'info',
          component: () => import('@/views/nursing/bookingForm/info'),
          name: 'info',
          hidden: true,
          meta: { activeMenu: '/nursing/bookingForm' },
        },
      ],
    },
    {
      path: 'afterSales',
      component: () => import('@/views/nursing/afterSales'),
      name: 'afterSales',
      meta: {
        title: '售后处理',
        roles: 'NURSING_AFTERMARKET',
      },
    },
    {
      path: 'evaluate',
      component: () => import('@/views/nursing/evaluate'),
      name: 'evaluate',
      meta: {
        title: '患者评价',
        roles: 'NURSING_EVALUATE',
      },
    },
  ],
}
