const helper = {
  getCurrentDateTime () {
    const d = new Date()
    const year = d.getFullYear()
    const month = d.getMonth()
    const date = d.getDate()
    const time = d.toLocaleTimeString('en-SG', { hour12: false })
    return `${year}/${month}/${date} ${time}`
  },

  getCurrentTime () {
    const d = new Date()
    if (d.getHours() < 10) {
      return `0${d.getHours()}:${d.getMinutes()}`
    }
    return `${d.getHours()}:${d.getMinutes()}`
  },

  getCurrentDay () {
    const d = new Date()
    return d.getDay()
  },

  nullUndefinedOrBlank (value) {
    return value === null || value === undefined || value === ''
  },

  notEmpty (obj) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) { return true }
    }
    return false
  },

  arrayEmpty (arr) {
    return arr === undefined || arr.length === 0
  },

  titleize (str) {
    str = str.split('_')

    for (let i = 0, x = str.length; i < x; i++) {
      str[i] = str[i][0].toUpperCase() + str[i].substr(1)
    }

    return str.join(' ')
  },

  isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array
  }
}

export default helper
