export class City {
    name: string = '';
    countryCode: string = '';

    constructor(name : string, countryCode : string) {
        this.name = name;
        this.countryCode = countryCode;
    }

    toString() {
        return `${this.name},${this.countryCode}`;
    }
}
