import Vue from "vue";

import { axios, storage } from '../utils'
import { initialState } from './state'

export const CHANGE_SESSION = (state, session) => {
  if (session && session.token) {
    // change axios authorization header
    axios.defaults.headers.Authorization = `Bearer ${session.token}`
  }
  // TODO: new session mixin
  Object.assign(state.session, session)
  // storage.set('wedn_net_session_info', state.session)
}

export const SET_USER = (state, session) => {
  axios.defaults.headers.Authorization = `Basic ${session.encodedUser}`

  Object.assign(state.session, session)
  localStorage.setItem("pega_vue_user", session.encodedUser);
}

export const SET_USER_DATA = (state, userData) => {
  const targetUserData = {
    name: userData.pyLabel,
    id: userData.pyUserIdentifier,
    accessGroup: userData.pyAccessGroup,
    email: userData.pyAddresses.Email.pyEmailAddress,
    workbaskets: userData.pyWorkbasket
  }
  state.session = Object.assign({}, state.session, targetUserData)

  state.work.activeWorkqueue = "worklist"
  state.work.workqueues = userData.pyWorkbasket
}

export const SET_WORKQUEUE = (state, payload) => {
  state.work.activeWorkqueue = payload.name
  state.work.worklist = payload.data.pxResults
}

export const SET_RECENTS = (state, { data }) => {
  state.cases.recents = data.pxResults
}

export const SET_CASETYPES = (state, payload) => {
  state.cases.types = payload.caseTypes
}

export const SET_CASE_CREATION_PAGE = (state, payload) => {
  // When receiving UI data for creation page, initial view visibility is not set
  payload.creation_page.visible = true;
  Vue.set(state.cases.creationPages, payload.caseTypeID, payload.creation_page)
}

export const ADD_PAGE = (state, { id, data }) => {
  // When receiving UI data for creation page, initial view visibility is not set
  data.visible = true;
  Vue.set(state.cases.pages, id, data)
}

export const ADD_CASE_VIEW = (state, { id, data }) => {
  Vue.set(state.cases.views, id, data)
}

export const SET_CASE = (state, { id, data }) => {
  Vue.set(state.cases.details, id, data)
}

export const SET_ASSIGNMENT = (state, payload) => {
  Vue.set(state.assignments.details, payload.data.caseID, payload.data)
}

export const SET_ASSIGNMENT_ACTION = (state, payload) => {
  Vue.set(state.assignments.actions, payload.caseID, payload)
}

export const ADD_OPEN_CASE = (state, id) => {
  const openCases = state.cases.open
  const index = openCases.indexOf(id)

  if (index === -1) {
    // the case is not currently in the list, push it on
    openCases.push(id)
  } else {
    // case already open, move it to end of list
    openCases.splice(index, 1)
    openCases.push(id)
  }
}

export const REMOVE_OPEN_CASE = (state, id) => {
  const openCases = state.cases.open
  openCases.splice(openCases.indexOf(id), 1)
}

export const CHANGE_ACTIVE_TAB = (state, id) => {
  state.cases.activeTab = id
}

export const SET_INITIAL_FORM_VALUES = (state, { id, values }) => {
  Vue.set(state.assignments.values, id, values)
}

export const UPDATE_FORM_VALUE = (state, { id, reference, value }) => {
  Vue.set(state.assignments.values[id], reference, value)
}

export const SET_VALIDATION_MESSAGES = (state, { id, messages, errors }) => {
  Vue.set(state.assignments.messages, id, messages)
  Vue.set(state.assignments.errors, id, errors)
}

export const RESET_VALIDATION_MESSAGES = (state, id) => {
  Vue.set(state.assignments.messages, id, { })
  Vue.set(state.assignments.errors, id, [])
 }

export const LOGOUT = (state, session) => {
  localStorage.removeItem("pega_vue_user")

  // reset state of store
  Object.assign(state, initialState())
}

export const TOGGLE_SIDEBAR_COLLAPSE = state => {
  state.sidebar.collapse = !state.sidebar.collapse
  storage.set('pega_vue_sidebar_collapse', state.sidebar.collapse)
}
