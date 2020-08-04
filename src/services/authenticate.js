/**
 * Authenticate service
 */

import Resource from './resource'
import { axios } from '../utils'

function get(encodedUser) {
  const url = `/${this.base}`
  const headers = { Authorization: "Basic " + encodedUser };

  return axios.get(url, { headers })
}

export default new Resource('authenticate', { get })
