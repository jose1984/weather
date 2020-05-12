<template>
    <div class="cities">
        <div class="cities__wrapper" v-if="weatherList">
            <Weather class="cities__city" :editMode="editMode" :weather="weather"
                v-for="weather in weatherList" :key="weather.id"
                @onDelete="onDelete" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Weather from '@/components/Weather.vue'
import { OpenWeather } from '@/models/OpenWeather'

@Component({
    components: {
        Weather
    }
})
export default class Cities extends Vue {
    @Prop({default: [], required: false}) weatherList!: Array<OpenWeather>
    @Prop() editMode = false

    onDelete (cityId: number) {
        this.$emit('onDelete', cityId)
    }
}
</script>

<style lang="scss" scoped>
.cities {
    &__wrapper {
        display: flex;
        flex-flow: wrap;
    }

    &__city {
        flex: 1 0;
        margin: 1em;
    }
}
</style>