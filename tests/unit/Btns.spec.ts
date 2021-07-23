import { mount } from '@vue/test-utils'
import Btns from '@/components/Player/btns'

describe('Btns', () => {
  let props: any

  beforeEach(() => {
    props = {
      paused: true,
      onPlay: () => {},
      onChange: () => {},
    }
  })

  it('should emit play event', () => {
    const wrapper = mount(Btns, { props })
    const playIcon = wrapper.find('.play-icon')

    playIcon.trigger('click')
    expect(wrapper.emitted('play')).toBeTruthy()
  })

  it('should emit change event', () => {
    const wrapper = mount(Btns, { props })
    const switchBtn = wrapper.findAll('.aside-icon')

    switchBtn[0].trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()

    switchBtn[1].trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('should render paused icon', () => {
    const wrapper = mount(Btns, { props: { ...props, paused: false } })
    const pausedIcon = wrapper.find('.el-icon-video-pause')

    expect(pausedIcon.exists()).toBeTruthy()
  })
})
