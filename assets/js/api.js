import axios from 'axios'

const BASE_URL = 'localhost:3000'
const headers = {
  'Content-Type': 'application/json'
}

const api = {
  apiAction (method, url, config) {
    return new Promise((resolve, reject) => {
      const actionObj = Object.assign({
        method,
        url: `${BASE_URL}${url}`,
        headers
      }, config)
      axios(actionObj)
        .then((response) => {
          resolve(Object.assign({ success: true }, response))
        })
        .catch((err) => {
          console.log(err)
          resolve(Object.assign({ success: false }, err.response))
        })
    })
  },

  get (url, params = {}) {
    return this.apiAction('get', url, { params })
  },

  post (url, data) {
    return this.apiAction('post', url, { data })
  }
}

export default api
