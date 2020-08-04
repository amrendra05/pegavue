/**
 * Custom axios instance
 */

import axios from 'axios'
import {PEGA_URL} from '../services/endpoints'

const API_POSTFIX = '/api/v1'

const instance = axios.create({
  baseURL: PEGA_URL + API_POSTFIX,
  timeout: 5000,
  headers: {
    // 'X-Custom-Header': 'foobar',
    // // true: need, false: dont need
    // 'Authorization': true,
    // 'X-Requested-With': 'XMLHttpRequest'
  }
})

/**
instance.interceptors.request.use(config => {
  // Add authorization header if set
  const encodedUser = localStorage.getItem('pega_vue_user');
  if (encodedUser) {
    config.headers.Authorization = `Basic ${encodedUser}`
  }
  return config
})
*/

export default instance
