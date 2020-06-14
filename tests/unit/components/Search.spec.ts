import { shallowMount } from '@vue/test-utils'
import { getByCityName } from '@/services/Weather'
import Search from '@/components/Search.vue'

jest.mock('@/services/Weather', () => ({
  getByCityName: jest.fn(() => Promise.resolve({ id: 1 }))
}))

describe('Search.vue', () => {
  test('edit button emits event', () => {
    const wrapper = shallowMount(Search)
    wrapper.find('a.search__edit--link').trigger('click')
    expect(wrapper.emitted('toggleEditMode')).toBeTruthy()
  })

  test('input event trigger a search', () => {
    jest.useFakeTimers()

    const wrapper = shallowMount(Search)
    const inputSearch = wrapper.find('input.search__input')
    inputSearch.setValue('some text')
    inputSearch.trigger('input')

    // wait debounce delay to be finished
    jest.runAllTimers()

    expect(getByCityName).toBeCalledWith('some text')
  })
})