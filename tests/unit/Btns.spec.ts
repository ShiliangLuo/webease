import { mount } from '@vue/test-utils'
import TestBtns from './utils/TestBtns'
import Btns from '@/components/Player/btns'
import { MusicList } from '@/types'

describe('Component', () => {
  it('should render btns', async () => {
    let paused = true
    let type = ''

    const wrapper = mount(Btns, {
      props: {
        paused,
        onPlay: (v: boolean) => {
          paused = v
        },
        onChange: (v: 'preview' | 'next') => {
          type = v
        },
      },
    })

    const playIcon = wrapper.find('.play-icon')
    const prewBtn = wrapper.findAll('.aside-icon')
    const nextBtn = wrapper.findAll('.aside-icon')

    await playIcon.trigger('click')
    expect(paused).toBe(true)

    await prewBtn[0].trigger('click')
    expect(type).toBe('preview')

    await nextBtn[1].trigger('click')
    expect(type).toBe('next')
  })
})
