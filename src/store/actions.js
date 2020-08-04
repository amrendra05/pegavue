import { 
  AuthenticateService, 
  DataService, 
  CaseService, 
  CasetypesService,
  AssignmentService 
} from '../services'
import { ReferenceHelper } from '../utils'

export const changeTitle = ({ commit }, title) => {
  commit('CHANGE_SESSION', { title: title })
}

export const createToken = ({ commit }, { username, password }) => {
  return TokenService.post({
    username: username.trim(),
    password: password.trim()
  })
    .then(res => {
      commit('CHANGE_SESSION', { token: res.data.token })
      return res.data.token
    })
}

export const login = ({ commit }, { username, password}) => {
  const encodedUser = btoa(username.trim() + ":" + password.trim());

  return AuthenticateService.get(encodedUser)
    .then(res => {
      commit('SET_USER', { encodedUser: encodedUser })
      return true;
    })
    .catch(err => {
      console.error(err)
      return Promise.reject(err);
    })
}

export const checkLogin = ({ commit, getters }) => {
  return new Promise((resolve, reject) => {
    // validate local store
    if (!getters.session.encodedUser) {
      return resolve(false)
    }

    return resolve(true)
  })
}

export const logout = ({ commit, getters }) => {
  commit('LOGOUT', { })
}

export const deleteToken = ({ commit, getters }) => {
  return TokenService.delete(getters.session.token)
    .then(res => {
      commit('CHANGE_SESSION', { token: null })
    })
}

export const getCurrentUserData = ({ commit }) => {
  return DataService.get('D_OperatorID')
    .then(res => {
      commit('SET_USER_DATA', res.data)
      return res.data
    })
}

export const getWorklist = ({ commit }) => {
  return DataService.get('D_Worklist', { params: { Work: true } })
    .then(res => {
      commit('SET_WORKQUEUE', { name: 'worklist', data: res.data })
      return res.data
    })
}

export const getWorkBasket = ({ commit }, wbname) => {
  return DataService.get('D_WorkBasket', { params: { WorkBasket: wbname } })
    .then(res => {
      commit('SET_WORKQUEUE', { name: wbname, data: res.data })
      return res.data
    })
}

export const getRecents = ({ commit }) => {
  return DataService.get('Declare_pxRecents', { params: { Work: true, Rule: false } })
    .then(res => {
      commit('SET_RECENTS', { data: res.data })
    })
}

export const getCasetypes = ({ commit }) => {
  return CasetypesService.get()
    .then(res => {
      commit('SET_CASETYPES', res.data)
      return res.data
    })
}

export const getCaseCreationPage = ({ commit }, id) => {
  return CasetypesService.get(id)
    .then(res => {
      commit('SET_CASE_CREATION_PAGE', res.data)
      return res.data
    })
}

export const createCase = ({ commit, dispatch }, { id, content }) => {
  // If we are passing in content on create, then convert it to nested
  if (content) {
    content = ReferenceHelper.getPostContent(content)
  }

  return CaseService.post(id, content)
    .then(
      res => {
        const { ID, nextAssignmentID } = res.data;

        dispatch('getCase', ID)
        dispatch('getAssignment', { id: nextAssignmentID })
        return dispatch('addOpenCase', ID)
      }
    )
}

export const getCase = ({ commit }, id) => {
  return CaseService.get(id)
    .then(
      res => {
        // Setting etag for potential later use
        res.data.etag = res.headers.etag
        commit('SET_CASE', { id: id, data: res.data })
        return res.data
      },
      error => {
        return null;
      }
    )
}

export const addOpenCase = ({ commit }, id) => {
  commit('ADD_OPEN_CASE', id)
}

export const removeOpenCase = ({ commit }, id) => {
  commit('REMOVE_OPEN_CASE', id)
}

export const changeActiveTab = ({ commit }, id) => {
  commit('CHANGE_ACTIVE_TAB', id)
}

export const getPage = ({ commit }, { id, pageID }) => {
  return CaseService.getPage(id, pageID)
    .then(res => {
      commit('ADD_PAGE', { id, data: res.data })
    })
}

export const getNextWork = ({ commit }) => {
  return AssignmentService.getNextAssignment()
    .then(res => {
      return res.data
    })
}

export const getAssignment = ({ commit, dispatch }, { id, actionID }) => {
  return AssignmentService.get(id)
    .then(res => {
      commit('SET_ASSIGNMENT', { id: id, data: res.data })
      dispatch('getActionForAssignment', { assignment: res.data, actionID })
      return res.data
    })
}

export const getActionForAssignment = ({ commit, dispatch }, { assignment, actionID }) => {
  if (!actionID) {
    actionID = assignment.actions[0].ID
  }

  dispatch('getCaseView', { id: assignment.caseID, viewID: 'pyCaseDetails' })

  return AssignmentService.getAction(assignment.ID, actionID)
    .then(res => {
      commit('SET_ASSIGNMENT_ACTION', res.data)
    })
}

export const getCaseView = ({ commit }, { id, viewID }) => {
  return CaseService.getView(id, viewID)
    .then(res => {
      commit('ADD_CASE_VIEW', { id, data: res.data })
    })
}

export const setInitialFormValues = ({ commit }, { id, view }) => {
  commit('SET_INITIAL_FORM_VALUES', { id: id, values: ReferenceHelper.getInitialValuesFromView(view)})
}

export const updateFormValue = ({ commit }, { id, reference, value }) => {
  return commit('UPDATE_FORM_VALUE', { id, reference, value })
}

export const toggleSidebarCollapse = ({ commit }) => {
  commit('TOGGLE_SIDEBAR_COLLAPSE')
}

export const saveCase = ({ commit, dispatch }, { id, etag, values }) => {
  return CaseService.put(
    id,
    etag,
    ReferenceHelper.getPostContent(values),
  )
}

export const performActionOnAssignment = ({ commit, dispatch }, { id, assignmentID, actionID, values }) => {
  return AssignmentService.postAssignmentAction(assignmentID, actionID, values)
    .then(
      res => {
        dispatch('getCase', id)
        if (res.data.nextAssignmentID) {
          return dispatch('getAssignment', { id: res.data.nextAssignmentID })
        } else {
          // get view for the case
          return dispatch('getPage', { id, pageID: res.data.nextPageID })
        }
      },
      error => {
        dispatch('handleRESTErrors', { id, response: error.response})
        return error.response
      }
    )
}

export const performRefreshOnAssignment = ({commit, dispatch }, { assignmentID, actionID, content }) => {
  return AssignmentService.refreshAssignmentAction(assignmentID, actionID, content)
    .then(
      res => {
        commit('SET_ASSIGNMENT_ACTION', res.data)
      },
      error => {
        debugger
      }
    )
}
export const resetValidationMessages = ({ commit, dispatch }, id) => {
  commit('RESET_VALIDATION_MESSAGES', id)
}

export const handleRESTErrors = ({ commit, dispatch }, { id, response}) => {
  const { data } = response

  if (data.errors) {
    data.errors.forEach(error => {
      dispatch('handleRESTError', { id, error})
    })
  }
}

export const handleRESTError = ({ commit, dispatch }, { id, error }) => {
  switch (error.ID) {
    // Validation errors found, put them into store
    case "Pega_API_055": {
      let messages = { }
      let errors = []

      error.ValidationMessages.forEach(message => {
        if( message.Path ) {
          messages[ReferenceHelper.expandRelativePath(message.Path)] = message.ValidationMessage
        } else {
          errors.push( message.ValidationMessage );
        }
      })

      commit('SET_VALIDATION_MESSAGES', { id, messages, errors })
    }
    default: {
      // Add other error code handlers here
    }
  }
}
