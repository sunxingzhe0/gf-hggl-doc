/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
// import RouterView from '@/components/RouterView'
export default {
  path: '/reconciliation',
  component: Layout,
  redirect: '/reconciliation',
  name: 'reconciliation',
  alwaysShow: true,
  meta: {
    title: '对账',
    icon: 'sidebar-order',
    roles: 'RECONCILIATION',
  },
  children: [
    {
      path: 'reconciliation',
      component: () => import('@/views/reconciliation/reconciliation'),
      name: 'reconciliation',
      meta: {
        title: '对账',
        roles: 'RECONCILIATION',
      },
    },
  ],
}
