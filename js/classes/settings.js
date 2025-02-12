class Settings {
    constructor(options = {}) {
        // Fill out all the defaults, and then allow them to be overridden.
        Object.assign(this, {
            reloadTime: 15
        }, options)
    }

    getValues() {
        return {
            reloadTime: this.reloadTime
        }
    }
}