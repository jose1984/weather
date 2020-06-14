<template>
  <div id="app">
    <div id="background-fixed"></div>
    <Search
      @onNewCity="addCity"
      @toggleEditMode="editMode = !editMode"
      @onDelete="onDelete"
      :editMode="editMode" />
    <Cities
      :weatherList="weathers"
      @onDelete="onDelete" 
      @onChange="onChange"
      :editMode="editMode" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cities from '@/components/Cities.vue'
import Search from '@/components/Search.vue'
import { getCities, registerCity } from '@/services/Persistance'
import { OpenWeather } from '@/models/OpenWeather'
import * as OpenWeatherService from '@/services/Weather'
import { registerAll } from '@/services/Persistance'

@Component({
  components: {
    Cities,
    Search
  },
})
export default class App extends Vue {
    weathers: Array<OpenWeather> = []
    editMode = false

    created(): void {
      this.updateCities()
    }

    onDelete(cityId: number): void {
      registerCity(cityId, true)
      this.weathers = this.weathers.filter((item) => item.id !== cityId)
    }

    onChange (weatherList: Array<OpenWeather>): void {
      registerAll(weatherList.map(weather => weather.id))
    }

    async addCity(weather: OpenWeather): Promise<void> {
      registerCity(weather.id)
      this.weathers.push(weather)
    }

    async updateCities (): Promise<void> {
      this.weathers = await Promise.all(
        getCities().map(async city => {
          const intCity = parseInt(city)
          return OpenWeatherService.getById(intCity)
        })
      )
      if (this.weathers && this.weathers.length === 0) {
        this.editMode = true
      }
    }
}
</script>
<style lang="scss">
html, body {
  height: 100vh;
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
  min-height: 100vh;
  margin-bottom: -50px;
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
