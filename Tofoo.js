import { immune, isArray } from "./utils.js"
const Tofoo = function(selector, dataSrc) {
  let props = {}
  let events = {}
  let subscriptions = {}

  const set = (key, value) => (props[key] = value)
  const get = key => immune(props[key])
  const getAll = _ => immune(props)
  const emit = (event, payload) => {
    if (!events[event] || events[event].length < 1) {
      return
    }
    events[event].forEach(emitter => emitter(payload))
    return Tofoo
  }
  const on = (event, callback) => {
    if (!events[event]) {
      events[event] = []
    }
    events[event].push(callback)
    return Tofoo
  }
  const off = (event, callback) => {
    if (!events.hasOwnProperty(event)) {
      return Tofoo
    }

    if (callback === undefined) {
      delete events[event]
      return Tofoo
    }

    events[event] = events[event].filter(emitter => emitter !== callback)
    return Tofoo
  }
  const watch = (attribute, action) => {
    if (!subscriptions[attribute]) {
      subscriptions[attribute] = []
    }
    subscriptions[attribute].push(action)
  }
  const react = attribute => {
    if (!subscriptions[attribute] || subscriptions[attribute].length < 1) {
      return
    }
    subscriptions[attribute].forEach(action => action())
  }
  const reactifyArray = (obj, key) => {
    obj[key].push = function(item) {
      Array.prototype.push.call(this, item)
      react(key)
    }
  }
  const reactifyObject = (obj, key) => {
    let val = obj[key]
    Object.defineProperty(obj, key, {
      get() {
        return val
      },
      set(newVal) {
        val = newVal
        react(key)
      }
    })
  }
  const reactifyData = (obj) => {
    for (const key in obj) {
      if (! obj.hasOwnProperty(key)) {
        continue
      }
      if (isArray(obj[key])) {
        reactifyArray(obj, key)
        continue
      }
      reactifyObject(obj, key)
    }
  }

  const parseDOM = (dom, observable) => {
    const binds = dom.querySelectorAll('[f-bind]')
    binds.forEach(node => syncNode(node, observable, node.attributes['f-bind'].value))
    const models = dom.querySelectorAll("[f-model]")
    models.forEach(model => model.addEventListener("keydown", update(model.attributes["f-model"].value)))
  }

  function syncNode(node, obj, property) {
    node.textContent = obj[property]
    watch(property, _ => (node.textContent = obj[property] || ""))
  }

  function update(attribute) {
    return event => dataSrc[attribute] = event.target.value
  }

  reactifyData(dataSrc)
  parseDOM(document.querySelector(selector), dataSrc)
  return { set, get, getAll, emit, on, off, watch, react, data: dataSrc }
}

export default Tofoo