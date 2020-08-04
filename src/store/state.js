import { axios, storage } from '../utils'

export const initialState = () => {
  var isCollapsed = storage.get('pega_vue_sidebar_collapse');
  return {
    session: { encodedUser: localStorage.getItem('pega_vue_user') }  || { },
    work: { 
      worklist: [ ],
      workqueues: [ ],
      activeWorkqueue: 'worklist'  //"worklist" for default worklist else name of workqueue
    },
    cases: { 
      types: [],
      open: [],
      views: {},
      pages: {},
      creationPages: {},
      details: {},
      recents: [],
      activeTab: 'Dashboard'
    },
    assignments: {
      details: {},
      actions: {},
      values: {},
      // messages have a field associated with them, errors are non-field specific
      messages: {},
      errors: []
    },
    sidebar: {
      collapse: isCollapsed
    }
  }
}

const state = initialState()

if (state.session && state.session.encodedUser) {
  // init axios headers
  axios.defaults.headers.Authorization = `Basic ${state.session.encodedUser}`
 }

export default state
