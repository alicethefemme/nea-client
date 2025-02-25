class Settings {
    constructor(options = {}) {
        // Fill out all the defaults, and then allow them to be overridden.
        Object.assign(this, {
            reloadTime: 15,
            customLogPath: ''
        }, options)
    }



    getValues() {
        return {
            reloadTime: this.reloadTime,
            customLogPath: this.customLogPath
        };
    }

    fillFromJson(json) {
        this.reloadTime = parseInt(json['reloadTime']);
        this.customLogPath = json['customLogPath'];

        return this;
    }
}

module.exports = {
    Settings
}