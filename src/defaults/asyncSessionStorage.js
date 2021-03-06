var nextTick = process && process.nextTick ? process.nextTick : setImmediate

const noLS = process && process.env && process.env.NODE_ENV === 'production'
  ? () => { /* noop */ return null }
  : () => {
    console.error('redux-persist asyncSessionStorage requires a global sessionStorage object. Either use a different storage backend or if this is a universal redux application you probably should conditionally persist like so: https://gist.github.com/rt2zz/ac9eb396793f95ff3c3b')
    return null
  }

function hasSessionStorage () {
  try {
    return typeof window === 'object' && typeof window.sessionStorage !== 'undefined'
  } catch (e) {
    return false
  }
}

var sessionStorage = hasSessionStorage()
  ? window.sessionStorage
  : { getItem: noLS, setItem: noLS, removeItem: noLS, getAllKeys: noLS }

export default {
  getItem: function (key, cb) {
    try {
      var s = sessionStorage.getItem(key)
      nextTick(() => {
        cb(null, s)
      })
    } catch (e) {
      cb(e)
    }
  },
  setItem: function (key, string, cb) {
    try {
      sessionStorage.setItem(key, string)
      nextTick(() => {
        cb(null)
      })
    } catch (e) {
      cb(e)
    }
  },
  removeItem: function (key, cb) {
    try {
      sessionStorage.removeItem(key)
      nextTick(() => {
        cb(null)
      })
    } catch (e) {
      cb(e)
    }
  },
  getAllKeys: function (cb) {
    try {
      var keys = []
      for (var i = 0; i < sessionStorage.length; i++) {
        keys.push(sessionStorage.key(i))
      }
      nextTick(() => {
        cb(null, keys)
      })
    } catch (e) {
      cb(e)
    }
  }
}
