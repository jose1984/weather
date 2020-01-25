import { http } from '@/utils/Http'
import { OpenWeather } from '@/models/OpenWeather'

const UNITS : string = 'metric'
const API_URL : string = 'https://api.openweathermap.org'
const API_VERSION : string = '2.5'
const API_KEY : string = 'e1f931b737580e4839dfba8e99117d64'
const API_LANG : string = 'es'

export function getByCityName (city: string) : Promise<OpenWeather> {
    return http<OpenWeather>(
        `${API_URL}/data/${API_VERSION}/weather?q=${city}&units=${UNITS}&APPID=${API_KEY}&lang=es`
    )
}

export function getById (cityId: number) : Promise<OpenWeather> {
    return http<OpenWeather>(
        `${API_URL}/data/${API_VERSION}/weather?id=${cityId}&units=${UNITS}&APPID=${API_KEY}&lang=es`
    )
}

export function getImageUrl (weather: OpenWeather) {
    return `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
}