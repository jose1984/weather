<template>
    <div class="search">
        <input type="search" class="search__input"
            @input.prevent="search"
            v-model="searchText"
            placeholder="Buscar una nueva ciudad...">
        <div class="search__result" v-if="result">
            <Weather :weather="result" :registered="registered" @onRegister="onRegister" @onDelete="onDelete" />
        </div>
    </div>
</template>
<script lang="ts">
/* eslint-disable no-console */

import { Component, Vue } from 'vue-property-decorator'
import { debounce } from 'typescript-debounce-decorator'
import * as OpenWeatherService from '@/services/Weather'
import Weather from '@/components/Weather.vue'
import { OpenWeather } from '@/models/OpenWeather'
import { registerCity, isRegisteredCity } from '@/services/Persistance'

@Component({
    name: 'Search',
    components: {
        Weather
    }
})
export default class Search extends Vue {
    result: any = null
    registered: boolean = false
    searchText: string = ''
    isLoading: boolean = false

    @debounce(1000, { leading: false })
    async search() {
        this.result = null
        if (this.searchText) {
            this.isLoading = true
            try {
                const result: OpenWeather = await OpenWeatherService.getByCityName(this.searchText)
                this.registered = isRegisteredCity(result.id.toString())
                this.result = result
            } catch (e) {
                console.log(e)
            }
            this.isLoading = false
        }
    }

    onRegister () {
        registerCity(this.result.id)
        this.$emit('onNewCity', this.result)
        this.clearResults()
    }

    onDelete (cityId: number) {
        this.$emit('onDelete', cityId)
        this.clearResults()
    }

    clearResults () {
        this.registered = true
        this.result = null
        this.searchText = ''
    }
}
</script>
<style lang="scss" scoped>
.search {
    padding: 0 1em;

    &__input {
        border: none;
        padding: .5em 1em;
        font-size: 1.5em;
        width: 100%;
        max-width: 500px;
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, .39);
        border-radius: 3px;
    }

    &__result {
        margin-top: 1em;
    }
}
</style>