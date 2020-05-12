import * as http from '@/utils/Http'
import { OpenWeather } from '@/models/OpenWeather'

const UNITS = 'metric'
const API_URL = 'https://api.openweathermap.org'
const API_VERSION = '2.5'
const API_KEY = process.env.VUE_APP_OPENWHEATHERMAP_API_KEY
const API_LANG = 'es'

export function getByCityName (city: string): Promise<OpenWeather> {
    return http.get<OpenWeather>(
        `${API_URL}/data/${API_VERSION}/weather?q=${city}&units=${UNITS}&APPID=${API_KEY}&lang=${API_LANG}`
    )
}

export function getById (cityId: number): Promise<OpenWeather> {
    return http.get<OpenWeather>(
        `${API_URL}/data/${API_VERSION}/weather?id=${cityId}&units=${UNITS}&APPID=${API_KEY}&lang=${API_LANG}`
    )
}

export function getImageUrl (weather: OpenWeather) {
    return `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
}