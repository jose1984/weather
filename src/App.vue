<template>
  <div id="app">
    <div id="background-fixed"></div>
    <Search @onNewCity="addCity" @edit="editMode = !editMode" @onDelete="onDelete" />
    <Cities :weatherList="weathers" @onDelete="onDelete" :editMode="editMode" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cities from './components/Cities.vue'
import Search from '@/components/Search.vue'
import { getCities, registerCity } from '@/services/Persistance'
import { OpenWeather } from '@/models/OpenWeather'
import * as OpenWeatherService from '@/services/Weather'

@Component({
  components: {
    Cities,
    Search
  },
})
export default class App extends Vue {
    weathers: Array<OpenWeather> = []
    editMode = false

    created() {
        this.updateCities()
    }

    onDelete(cityId: number) {
        registerCity(cityId, true)
        this.weathers = this.weathers.filter((item) => item.id !== cityId)
    }

    async addCity(weather: OpenWeather) {
      this.weathers.push(weather)
    }

    async updateCities () {
        const cities = getCities()
        this.weathers = []
        for (const city of cities) {
            const intCity = parseInt(city)
            const weather: OpenWeather = await OpenWeatherService.getById(intCity)
            this.weathers.push(weather)
        }
    }
}
</script>
<style lang="scss">
html, body {
  height: 100%;
  margin: 0;
}

html {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
*, *:before, *:after {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
}

body,
input {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

input {
  border-radius: 0;
  -webkit-appearance: none;
}

.footer {
  height: 50px;
}

footer {
  color: #ffffff;
  font-size: .8em;
  background-color: #09101c40;
  display: flex;
  justify-content: center;
  align-items: center;
}

#app {
  min-height: 100%;
  min-height: 100%;
  margin-bottom: -50px;
  padding-top: 1em;
  padding-bottom: 5em;
}

#background-fixed {
  position: fixed;
  z-index: -2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(./assets/background.jpg);
}
</style>
