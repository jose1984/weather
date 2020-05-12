<template>
    <div class="search">
        <input type="search" class="search__input"
            @input.prevent="search"
            v-model="searchText"
            placeholder="Nueva ciudad...">
        
        <div class="search__edit">
            <a @click="toggleEditMode">
                <template v-if="editMode">Hecho</template>
                <template v-else>Editar</template>
            </a>
        </div>
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

const DEBOUNCE_TIMEOUT = 1e3

@Component({
    name: 'Search',
    components: {
        Weather
    }
})
export default class Search extends Vue {
    result: OpenWeather | null = null
    registered = false
    searchText = ''
    isLoading = false
    editMode = false

    @debounce(DEBOUNCE_TIMEOUT, { leading: false })
    async search() {
        this.result = null
        if (this.searchText) {
            this.isLoading = true
            try {
                const result: OpenWeather = await OpenWeatherService.getByCityName(this.searchText)
                this.registered = isRegisteredCity(result.id.toString())
                this.result = result
            } catch (e) {
                console.error('Search ->', e)
            }
            this.isLoading = false
        }
    }

    onRegister () {
        if (this.result) {
            registerCity(this.result.id)
            this.$emit('onNewCity', this.result)
            this.clearResults()
        }
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

    toggleEditMode () {
        this.editMode = !this.editMode
        this.$emit('edit')
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
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, .26);
        border-radius: 1px;
    }

    &__result {
        margin-top: 1em;
    }

    &__edit {
        color: white;
        font-size: 1.5em;
        text-align: right;
        margin-top: 1em;
        cursor: pointer;
    }
}
</style>