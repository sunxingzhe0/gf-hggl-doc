export default [
  {
    id: 1,
    label: '护理',
    children: [
      {
        id: 'NURSING_TASK',
        label: '任务管理',
      },
      {
        id: 'NURSING_WORK_ORDER',
        label: '工单管理',
      },
      {
        id: 'NURSING_ORDER',
        label: '预约单',
      },
      {
        id: 'NURSING_AFTERMARKET',
        label: '售后处理',
      },
      {
        id: 'NURSING_EVALUATE',
        label: '患者评价',
      },
    ],
  },
  {
    id: 2,
    label: '护工',
    children: [
      {
        id: 'WORKER_GROUP',
        label: '护工分组',
      },
      {
        id: 'WORKER_PERSON',
        label: '护工管理',
      },
      {
        id: 'WORKER_COUNT',
        label: '工况统计',
      },
      {
        id: 'WORKER_SCHEDULING',
        label: '排班管理',
      },
      {
        id: 'WORKER_TIME',
        label: '时段规则',
      },
    ],
  },
  {
    id: 3,
    label: '用户',
    children: [
      {
        id: 'USER_WX',
        label: '微信用户',
      },
    ],
  },
  {
    id: 4,
    label: '对账',
    children: [
      {
        id: 'RECONCILIATION',
        label: '对账',
      },
    ],
  },
  {
    id: 5,
    label: '统计',
    children: [
      {
        id: 'COUNT_ORDER',
        label: '销售业绩',
      },
      {
        id: 'COUNT_EVALUATE',
        label: '评价分析',
      },
    ],
  },
  {
    id: 6,
    label: '设置',
    children: [
      {
        id: 'SETTING_BIS',
        label: '业务管理',
      },
      {
        id: 'SETTING_CAROUSEL',
        label: '轮播图',
      },
      {
        id: 'SETTING_INFO',
        label: '个人信息',
      },
      {
        id: 'SETTING_ACCOUNT',
        label: '账号管理',
      },
      {
        id: 'SETTING_ROLE',
        label: '角色管理',
      },
      {
        id: 'SETTING_MESSAGE',
        label: '系统消息',
      },
    ],
  },
]
