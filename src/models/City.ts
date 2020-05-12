export class City {
    name = ''
    countryCode = ''

    constructor(name : string, countryCode : string) {
        this.name = name
        this.countryCode = countryCode
    }

    toString() {
        return `${this.name},${this.countryCode}`
    }
}
