import { immune, isArray } from "./utils/utils.js"
const Tofoo = function(selector, dataSrc) {
  let props = {}

  let subscriptions = {}

  const set = (key, value) => (props[key] = value)
  const get = key => immune(props[key])
  const getAll = _ => immune(props)

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
  const syncNode = function (node, obj, property) {
    node.textContent = obj[property]
    watch(property, _ => (node.textContent = obj[property] || ""))
  }
  const update = function (observable, attribute) {
    return event => (observable[attribute] = event.target.value)
  }

  const loopHandler = function (element, observable, parent) {
    const parts = element.attributes['T-for'].value.split(' in ')
    let items = observable[parts[0]]
    
    while (parent.hasChildNodes()) {
      parent.removeChild(parent.firstChild);
    }
    let regex = new RegExp(`${parts[1]}\\.(\\w+)`);
    
    items.forEach(item => {
      let child = element.cloneNode(true)
      child.removeAttribute('T-for')
      child.removeAttribute('id')
      let content = child.textContent
      let result = content.replace(/{\s*[\w\.]+\s*}/g, (str) => {
        return item[str.match(regex)[1]]
      })
      child.textContent = result;
      parent.appendChild(child)
    })
  }

  const parseDOM = (dom, observable) => {
    const binds = dom.querySelectorAll('[T-bind]')
    binds.forEach(node => {
      syncNode(node, observable, node.attributes["T-bind"].value)
    })
    const models = dom.querySelectorAll("[T-model]")
    models.forEach(model =>
      model.addEventListener(
        "keydown",
        update(observable, model.attributes["T-model"].value)
      )
    )
    const loops = dom.querySelectorAll('[T-for]')
    loops.forEach(element => {
      const parts = element.attributes["T-for"].value.split(" in ")
      const parent = element.parentNode;
      loopHandler(element, observable, parent)
      watch(parts[0], _ => loopHandler(element, observable, parent))
    })
  }

  reactifyData(dataSrc)
  parseDOM(document.querySelector(selector), dataSrc)
  return { set, get, getAll, watch, react, data: dataSrc }
}

export default Tofoo