/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
// import RouterView from '@/components/RouterView'
export default {
  path: '/statistics',
  component: Layout,
  redirect: '/statistics',
  name: 'statistics',
  alwaysShow: true,
  meta: {
    title: '统计',
    icon: 'sidebar-statistics',
    roles: 'COUNT_ORDER',
  },
  children: [
    {
      path: 'achievement',
      component: () => import('@/views/statistics/achievement'),
      name: 'achievement',
      meta: {
        title: '销售业绩',
        roles: 'COUNT_ORDER',
      },
    },
    {
      path: 'evaluate',
      component: () => import('@/views/statistics/evaluate'),
      name: 'evaluate',
      meta: {
        title: '评价分析',
        roles: 'COUNT_ORDER',
      },
    },
  ],
}
