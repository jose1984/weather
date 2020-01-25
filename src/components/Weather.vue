<template>
    <div class="weather">
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
        <div class="weather__sunrise">Amanece: {{ sunrise.toLocaleTimeString() }}</div>
        <div class="weather__sunset">Atardece: {{ sunset.toLocaleTimeString() }}</div>

        <div class="weather__add-button" v-show="!registered">
            <button class="weather__button button-primary" @click.prevent="$emit('onRegister', weather.id)">Añadir</button>
        </div>

        <div class="weather__del-button" v-show="registered">
            <button class="weather__button button-danger" @click.prevent="$emit('onDelete', weather.id)">Quitar</button>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { OpenWeather } from '@/models/OpenWeather'
import { getImageUrl } from '@/services/Weather'
import * as OpenWeatherService from '@/services/Weather'

const INTERVAL: number = 60000

@Component({
    name: 'Weather'
})
export default class Weather extends Vue {

    @Prop({ required: true }) weather!: OpenWeather
    @Prop({ default: true }) registered!: boolean
    scheduler!: number

    name: string = ''
    countryCode: string = ''
    temperature: number = 0
    feelsLike: number = 0
    humidity: number = 0
    sunrise: Date = new Date(0)
    sunset: Date = new Date(0)
    description: string = ''
    img: string = ''

    async created() {
        this.scheduler = setInterval(this.updateCities, INTERVAL)
        this.renderData(this.weather)
    }

    beforeDestroy () {
        clearInterval(this.scheduler)
    }

    async updateCities () {
        const weather: OpenWeather = await OpenWeatherService.getById(this.weather.id)
        this.renderData(weather)
    }

    renderData (weather: OpenWeather) {
        this.name = weather.name
        this.countryCode = weather.sys.country
        this.temperature = Math.round(weather.main.temp)
        this.feelsLike = Math.round(weather.main.feels_like)
        this.humidity = Math.round(weather.main.humidity)
        this.sunrise.setUTCSeconds(weather.sys.sunrise)
        this.sunset.setUTCSeconds(weather.sys.sunset)
        this.description = weather.weather[0].description
        this.img = getImageUrl(weather)
    }
}
</script>
<style lang="scss" scoped>
.weather {
    background-color: white;
    padding: 2em;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, .39);
    border-radius: 1%;

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

    &__add-button,
    &__del-button {
        margin-top: 2em;
    }

    &__button {
        border: none;
        color: white;
        padding-top: .5em;
        padding-bottom: .5em;
        width: 100%;
        font-size: 1.5em;
    }

    .button {
        &-primary {
            background-color: green;
        }

        &-danger {
            color: #ffcaca;
            font-weight: bold;
            background-color: #ea0909;
        }
    }
}
</style>