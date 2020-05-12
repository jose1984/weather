<template>
    <div class="weather">
        <div class="weather__del-button" v-show="registered && editMode">
            <button class="weather__button button-danger" @click.prevent="$emit('onDelete', weather.id)">Quitar</button>
        </div>
        <div class="weather__city">{{ name }}, {{ countryCode }}</div>
        <div class="weather__info"><span>{{ description }}</span></div>
        <div class="weather__weather">
            <div class="weather-weather__temperature">
                {{ temperature }}<span class="celsius">°C</span>
            </div>
            <img  class="weather-weather__icon" :src="img" :alt="description">
        </div>
        
        <div class="weather__feels-like">Sensación térmica: {{ feelsLike }}°C</div>
        <div class="weather__humidity">Humedad: {{ humidity }}%</div>
        <div class="weather__sunrise">🌅 {{ formatAMPM(sunrise) }}</div>
        <div class="weather__sunset">🌄 {{ formatAMPM(sunset) }}</div>

        <div class="weather__add-button" v-show="!registered">
            <button class="weather__button button-primary" @click.prevent="$emit('onRegister', weather.id)">Añadir</button>
        </div>

        <div class="weather__last-update" @click.prevent="updateCity">Actualizado a las: {{ lastUpdate.toLocaleTimeString() }}</div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { OpenWeather } from '@/models/OpenWeather'
import { getImageUrl } from '@/services/Weather'
import * as OpenWeatherService from '@/services/Weather'

const INTERVAL = 6e4

@Component({
    name: 'Weather'
})
export default class Weather extends Vue {

    @Prop({ required: true }) weather!: OpenWeather
    @Prop({ default: true }) registered!: boolean
    @Prop() editMode = false
    scheduler!: number

    name = ''
    countryCode = ''
    temperature = 0
    feelsLike = 0
    humidity = 0
    sunrise: Date = new Date(0)
    sunset: Date = new Date(0)
    description = ''
    img = ''
    lastUpdate = new Date()

    async created() {
        this.scheduler = setInterval(this.updateCity, INTERVAL)
        this.renderData(this.weather)
    }

    beforeDestroy () {
        clearInterval(this.scheduler)
    }

    async updateCity () {
        const weather: OpenWeather = await OpenWeatherService.getById(this.weather.id)
        this.renderData(weather)
    }

    renderData (weather: OpenWeather) {
        this.lastUpdate = new Date()

        this.name = weather.name
        this.countryCode = weather.sys.country
        this.temperature = Math.round(weather.main.temp)
        this.feelsLike = Math.round(weather.main.feels_like)
        this.humidity = Math.round(weather.main.humidity)
        this.sunrise = new Date(0)
        this.sunrise.setUTCSeconds(weather.sys.sunrise)
        this.sunset = new Date(0)
        this.sunset.setUTCSeconds(weather.sys.sunset)
        this.description = weather.weather[0].description
        this.img = getImageUrl(weather)
    }

    
    formatAMPM(date: Date) {
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
    background-color: white;
    padding: 2em;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, .26);
    border-radius: 1px;

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

    &__add-button {
        margin-top: 2em;
    }

    &__del-button {
        margin-bottom: 2em;
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