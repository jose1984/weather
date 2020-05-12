const SEPARATOR = ','

export function getCities (): string[] {
    const localStorageItem = localStorage.getItem('cities')
    return localStorageItem ? localStorageItem.split(SEPARATOR) : []
}

export function isRegisteredCity (cityId: string) {
    const cities: string[] = getCities()
    return cities.includes(cityId)
}

export function registerCity (cityId: number, unregister = false) {
    let cities: string[] = getCities()
    if (unregister) {
        cities = cities.filter(item => item !== cityId.toString())
    } else {
        cities.push(cityId.toString())
    }
    cities = cities.filter((item, index) => item && cities.indexOf(item) === index)
    localStorage.setItem('cities', cities.join(SEPARATOR))
}
