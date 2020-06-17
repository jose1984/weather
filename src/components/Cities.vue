<template>
    <div class="cities">
        <!-- Edit mode draggable -->
        <draggable :list="weatherList" @update="onChange" chosenClass="cities__city--choosen"
            v-if="editMode">
            <Weather class="cities__list" :editMode="editMode" :weather="weather"
                v-for="weather in weatherList" :key="weather.id"
                @onDelete="onDelete" />
        </draggable>
        <!-- Visual mode -->
        <div class="cities__wrapper" v-else>
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
import draggable from 'vuedraggable'

@Component({
    components: {
        Weather,
        draggable
    }
})
export default class Cities extends Vue {
    @Prop({default: [], required: false}) weatherList!: Array<OpenWeather>
    @Prop() editMode = false

    onDelete (cityId: number): void {
        this.$emit('onDelete', cityId)
    }

    onChange (): void {
        this.$emit('onChange', this.weatherList)
    }
}
</script>

<style lang="scss" scoped>
.cities {
    &__wrapper {
        display: flex;
        flex-flow: wrap;
    }

    &__city, &__list {
        margin: 1em;
    }

    &__city {
        flex: 1 0;

        &--choosen {
            opacity: .3;
        }
    }
}
</style>