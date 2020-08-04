/**
 * Change title when route
 * TODO: title case
 */
import router from '../router'

export default (Vue, options) => {
  let items

  // change title
  router.afterEach(route => {
    items = route.matched
      .map(item => (item.components.default[options.property] || item.components.default.name).toUpperCase())
      .reverse()
    // document.title = items.join(options.separator)
  })

  Object.defineProperties(Vue.prototype, {
    $title: {
      get: () => (title, fullname) => {
        if (fullname) {
          // document.title = title
        } else {
          // partial
          items[0] = title
          // document.title = items.join(options.separator)
        }
      }
    }
  })
}
