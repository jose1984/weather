const SEPARATOR = ','

export function getCities (): string[] {
    const localStorageItem = localStorage.getItem('cities')
    return localStorageItem ? localStorageItem.split(SEPARATOR) : []
}

export function registerAll (cities: Array<number>): void {
    localStorage.setItem('cities', cities.join(SEPARATOR))
}

export function isRegisteredCity (cityId: string): boolean {
    const cities: string[] = getCities()
    return cities.includes(cityId)
}

export function registerCity (cityId: number, unregister = false): void {
    let cities: string[] = getCities()
    if (unregister) {
        cities = cities.filter(item => item !== cityId.toString())
    } else {
        cities.push(cityId.toString())
    }
    cities = cities.filter((item, index) => item && cities.indexOf(item) === index)
    localStorage.setItem('cities', cities.join(SEPARATOR))
}
