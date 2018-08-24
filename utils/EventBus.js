const EventBus = (function () {
    let events = {}
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

    return { emit, on, off }
})()

export default EventBus