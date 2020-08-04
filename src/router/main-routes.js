export default [
  // - Dashboard
  {
    name: 'workarea',
    path: '',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: 'dashboard' */ '../views/main/workarea')
  },
  {
    name: 'new',
    path: 'new/:type',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: 'posts' */ '../views/main/new')
  },
]
