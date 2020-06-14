<template>
    <div class="search">
        <div class="search__edit">
            <a href="#" class="search__edit--link" @click.prevent="$emit('toggleEditMode')">
                <template v-if="editMode">Hecho</template>
                <template v-else>Editar</template>
            </a>
        </div>
        <transition name="search-fade">
            <div v-show="editMode">
                <input type="search" class="search__input"
                    @input.prevent="search"
                    v-model="searchText"
                    placeholder="Nueva ciudad...">

                <div class="search__result" v-if="result">
                    <Weather :weather="result" @onRegister="onRegister" @onDelete="onDelete" />
                </div>
            </div>
        </transition>
    </div>
</template>
<script lang="ts">
/* eslint-disable no-console */

import { Component, Prop, Vue } from 'vue-property-decorator'
import { debounce } from 'typescript-debounce-decorator'
import { getByCityName } from '@/services/Weather'
import Weather from '@/components/Weather.vue'
import { OpenWeather } from '@/models/OpenWeather'

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
    @Prop() editMode!: boolean

    @debounce(DEBOUNCE_TIMEOUT, { leading: false })
    async search(): Promise<void> {
        this.result = null
        if (this.searchText) {
            this.isLoading = true
            try {
                this.result = await getByCityName(this.searchText)
            } catch (e) {
                console.error('Search ->', e)
            }
            this.isLoading = false
        }
    }

    onRegister (): void {
        if (this.result) {
            this.$emit('onNewCity', this.result)
            this.clearResults()
        }
    }

    onDelete (cityId: number): void {
        this.$emit('onDelete', cityId)
        this.clearResults()
    }

    clearResults (): void {
        this.result = null
        this.searchText = ''
    }
}
</script>
<style lang="scss" scoped>
.search {
    backface-visibility: hidden;
    padding: 1em;

    &__input {
        border: none;
        padding: .5em 1em;
        font-size: 1.5em;
        width: 100%;
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, .26);
        border-radius: 1px;
    }

    &__result,
    &__input {
        margin-top: 1rem;
    }

    &__edit {
        font-size: 1.5em;
        text-align: right;

        &--link {
            cursor: pointer;
            color: white;
            text-decoration: none;
        }
    }

    &-fade {
        &-enter-active,
        &-leave-active {
            transition: opacity .3s;
        }
        &-enter,
        &-leave-to {
            opacity: 0;
        }
    }
}
</style>