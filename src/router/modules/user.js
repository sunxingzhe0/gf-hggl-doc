/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/components/layout'
// import RouterView from '@/components/RouterView'
export default {
  path: '/user',
  component: Layout,
  redirect: '/user',
  name: 'user',
  alwaysShow: true,
  meta: {
    title: '用户',
    icon: 'sidebar-patient',
    roles: 'USER_WX',
  },
  children: [
    {
      path: 'weChat',
      component: () => import('@/views/user/weChat'),
      name: 'weChat',
      meta: {
        title: '微信用户',
        roles: 'USER_WX',
      },
    },
  ],
}
