/**
 * Assignments service
 */

import Resource from './resource'
import { axios, ReferenceHelper } from '../utils'

function getNextAssignment() {
  const url = `/${this.base}/next`

  return axios.get(url)
}

function getAction(id, actionID, options) {
  const url = `/${this.base}/${id}/actions/${actionID}`

  return axios.get(url)
}

function postAssignmentAction(id, actionID, values) {
  const url = `/${this.base}/${id}`
  const postContent = ReferenceHelper.getPostContent(values)

  return axios.post(
    url,
    {
      content: ReferenceHelper.getPostContent(values)
    },
    {
      params: {
        actionID: actionID 
      }
    }
  )
}

function refreshAssignmentAction(id, actionID, content) {
  const url = `/${this.base}/${id}/actions/${actionID}/refresh`

  return axios.put(
    url,
    {
      content: content
    },
  )
}

export default new Resource('assignments', { getNextAssignment, getAction, postAssignmentAction, refreshAssignmentAction })
