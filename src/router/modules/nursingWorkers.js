/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
import RouterView from '@/components/RouterView'
export default {
  path: '/nursingWorkers',
  component: Layout,
  redirect: '/nursingWorkers',
  name: 'nursingWorkers',
  alwaysShow: true,
  meta: {
    title: '护工',
    icon: 'sidebar-drugs',
    roles: 'WORKER_GROUP',
  },
  children: [
    {
      path: 'group',
      component: () => import('@/views/nursingWorkers/group'),
      name: 'group',
      meta: {
        title: '护工分组',
        roles: 'WORKER_GROUP',
      },
    },
    {
      path: 'manage',
      component: RouterView,
      name: 'manage',
      meta: {
        title: '护工管理',
        roles: 'WORKER_PERSON',
      },
      redirect: '/nursingWorkers/manage/list',
      children: [
        {
          path: 'list',
          component: () => import('@/views/nursingWorkers/manage'),
          meta: { activeMenu: '/nursingWorkers/manage' },
          hidden: true,
        },
        {
          path: 'info',
          component: () => import('@/views/nursingWorkers/manage/info'),
          meta: { title: '详情页', activeMenu: '/nursingWorkers/manage' },
          hidden: true,
        },
      ],
    },
    {
      path: 'workCensus',
      component: () => import('@/views/nursingWorkers/workCensus'),
      name: 'workCensus',
      meta: {
        title: '工况统计',
        roles: 'WORKER_COUNT',
      },
    },
    {
      path: 'workface',
      component: RouterView,
      name: 'workface',
      meta: {
        title: '排班管理',
        roles: 'WORKER_SCHEDULING',
      },
      redirect: '/nursingWorkers/workface/list',
      children: [
        {
          path: 'list',
          component: () => import('@/views/nursingWorkers/workface'),
          meta: { activeMenu: '/nursingWorkers/workface' },
          hidden: true,
        },
        {
          path: 'add',
          component: () => import('@/views/nursingWorkers/workface/edit'),
          meta: { title: '新增排班', activeMenu: '/nursingWorkers/workface' },
          hidden: true,
        },
        {
          path: 'edit',
          component: () => import('@/views/nursingWorkers/workface/edit'),
          meta: { title: '编辑排班', activeMenu: '/nursingWorkers/workface' },
          hidden: true,
        },
        {
          path: 'info',
          component: () => import('@/views/nursingWorkers/workface/info'),
          meta: { activeMenu: '/nursingWorkers/workface' },
          hidden: true,
        },
      ],
    },
    {
      path: 'timeRule',
      component: RouterView,
      name: 'timeRule',
      meta: {
        title: '时段规则',
        roles: 'WORKER_TIME',
      },
      redirect: '/nursingWorkers/timeRule/list',
      children: [
        {
          path: 'list',
          component: () => import('@/views/nursingWorkers/timeRule'),
          meta: { activeMenu: '/nursingWorkers/timeRule' },
          hidden: true,
        },
        {
          path: 'addRule',
          component: () => import('@/views/nursingWorkers/timeRule/addRule'),
          meta: { title: '新增规则', activeMenu: '/nursingWorkers/timeRule' },
          hidden: true,
        },
        {
          path: 'seeRule',
          component: () => import('@/views/nursingWorkers/timeRule/seeRule'),
          meta: { title: '查看规则', activeMenu: '/nursingWorkers/timeRule' },
          hidden: true,
        },
      ],
    },
  ],
}
