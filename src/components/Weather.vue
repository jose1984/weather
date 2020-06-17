<template>
    <div class="weather">
        <div class="weather__edit" v-if="registered" v-show="editMode">
            <span class="weather__edit-city">{{ name }}, {{ countryCode }} - {{ temperature }}<span class="celsius">°C</span></span>
            <button class="weather__button weather__edit-del button-danger" @click.prevent="$emit('onDelete', weather.id)">Quitar</button>
        </div>
        <div class="weather__add-button" v-else>
            <button class="weather__button button-primary" @click.prevent="$emit('onRegister', weather.id)">Añadir</button>
        </div>

        <div class="weather-content" v-show="!editMode">
            <div class="weather__city">{{ name }}, {{ countryCode }}</div>
            <div class="weather__info"><span>{{ description }}</span></div>
            <div class="weather__weather">
                <div class="weather-weather__temperature">
                    {{ temperature }}<span class="celsius">°C</span>
                </div>
                <img  class="weather-weather__icon" :src="img" :alt="description">
            </div>
            
            <div class="weather__feels-like">Sensación térmica: <strong>{{ feelsLike }}°C</strong></div>
            <div class="weather__temp-minmax">Máx/mín hoy: <strong>{{ tempMax }}/{{ tempMin }}°C</strong></div>
            <div class="weather__humidity">Humedad: <strong>{{ humidity }}%</strong></div>
            <div class="weather__sunrise">🌅 <strong>{{ formatAMPM(sunrise) }}</strong></div>
            <div class="weather__sunset">🌄 <strong>{{ formatAMPM(sunset) }}</strong></div>

            <div class="weather__last-update" @click.prevent="updateCity">Actualizado a las: {{ lastUpdate.toLocaleTimeString() }}</div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { OpenWeather } from '@/models/OpenWeather'
import { getImageUrl } from '@/services/Weather'
import { isRegisteredCity } from '@/services/Persistance'
import * as OpenWeatherService from '@/services/Weather'

const INTERVAL = 6e4

@Component({
    name: 'Weather'
})
export default class Weather extends Vue {

    @Prop({ required: true }) weather!: OpenWeather
    @Prop() editMode!: boolean
    private scheduler!: number
    private intersectionObserver!: IntersectionObserver

    name = ''
    countryCode = ''
    temperature = 0
    tempMin = 0
    tempMax = 0
    feelsLike = 0
    humidity = 0
    sunrise: Date = new Date(0)
    sunset: Date = new Date(0)
    description = ''
    img = ''
    lastUpdate = new Date()
    registered = false

    async mounted(): Promise<void> {
        this.intersectionObserver = new IntersectionObserver(this.intersectionHandler);
        this.intersectionObserver.observe(this.$el)
        this.renderData(this.weather)
    }

    private intersectionHandler ([entry]: IntersectionObserverEntry[]): void {
        if (entry && entry.isIntersecting) {
            this.scheduler = setInterval(this.updateCity, INTERVAL)
        } else {
            clearInterval(this.scheduler)
        }
    }

    beforeDestroy (): void {
        clearInterval(this.scheduler)
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect()
        }
    }

    async updateCity (): Promise<void> {
        const weather = await OpenWeatherService.getById(this.weather.id)
        this.renderData(weather)
    }

    renderData (weather: OpenWeather): void {
        this.lastUpdate = new Date()

        this.name = weather.name
        this.countryCode = weather.sys.country
        this.temperature = Math.round(weather.main.temp)
        this.tempMin = Math.round(weather.main.temp_min)
        this.tempMax = Math.round(weather.main.temp_max)
        this.feelsLike = Math.round(weather.main.feels_like)
        this.humidity = Math.round(weather.main.humidity)
        this.sunrise = new Date(0)
        this.sunrise.setUTCSeconds(weather.sys.sunrise)
        this.sunset = new Date(0)
        this.sunset.setUTCSeconds(weather.sys.sunset)
        this.description = weather.weather[0].description
        this.img = getImageUrl(weather)

        this.registered = isRegisteredCity(weather.id.toString())
    }

    
    formatAMPM(date: Date): string {
        let hours = date.getHours()
        let minutes: string | number = date.getMinutes()
        const ampm = hours >= 12 ? 'pm' : 'am'
        hours = hours % 12
        hours = hours ? hours : 12
        minutes = minutes < 10 ? '0'+minutes : minutes
        const strTime = hours + ':' + minutes + ' ' + ampm
        return strTime
    }
}
</script>
<style lang="scss" scoped>
.weather {
    background-color: rgba(0, 0, 0, 0.36);
    padding: 2em;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, .26);
    border-radius: 1px;
    color: white;

    &-content {
        margin-top: 2em;
    }

    &__edit {
        display: flex;
        align-items: center;

        &-city {
            flex: 1 0;
            font-size: 1.4em;
        }

        &-del {
            flex: 0 0;
            margin-left: 1em;
        }
    }

    &__city,
    &__info {
        text-align: center;
    }

    &__city {
        font-size: 1.5em;
        font-weight: bold;
    }

    &__weather {
        display: flex;
        align-items: center;
        font-size: 3.5em;
    }

    &-weather {
        &__temperature {
            flex: 1 1;

            .celsius {
                color: #bfbfbf;
            }
        }

        &__icon {
            flex: 0 0;
        }
    }

    &__button {
        border: none;
        color: white;
        padding-top: .5em;
        padding-bottom: .5em;
        width: 100%;
        font-size: 1.5em;
    }

    &__last-update {
        text-align: right;
        font-size: .6em;
        font-style: italic;
        color: #aaa;
        cursor: pointer;
        margin-top: 1rem;

        &:after {
            content: '🔁';
            font-size: 1rem;
            font-style: normal;
            margin-left: .5em;
        }
    }

    .button {
        &-primary,
        &-danger {
            cursor: pointer;
            font-weight: bold;
        }

        &-primary {
            color: lightgreen;
            background-color: green;

            &:hover {
                color: #e1ffe1;
            }
        }

        &-danger {
            color: #ffcaca;
            background-color: #ea0909;

            &:hover {
                color: #ffeded;
            }
        }
    }
}
</style>