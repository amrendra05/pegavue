/**
 * Cases service
 */

import Resource from './resource'
import { axios } from '../utils'

function post(id, content, options) {
  const url = `/${this.base}/${id}`
  //if (!content) { content = { } }

  return axios.post(
    url, 
    { 
      caseTypeID: id,
      content: content,
      processID: 'pyStartCase'
    },
    options
  )
}

function put(id, etag, content) {
  const url = `/${this.base}/${id}`

  return axios.put(
    url, 
    { 
      content: content
    },
    {
      headers: {
        "If-Match": etag
      }
    }
  )
}

function getPage(id, pageID, options) {
  const url = `/${this.base}/${id}/pages/${pageID}`

  return axios.get(url, options)
}

function getView(id, caseID, options) {
  const url = `/${this.base}/${id}/views/${caseID}`

  return axios.get(url, options)
}

export default new Resource('cases', { getPage, getView, post, put })
