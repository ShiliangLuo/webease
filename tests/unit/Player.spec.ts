import { mount } from '@vue/test-utils'
import EasePlayer from '@/components/Player'
import Btns from '@/components/Player/btns'
import List from '@/components/Player/list'
import Lyric from '@/components/Player/lyric'
import Progress from '@/components/Player/progress'
import Volume from '@/components/Player/volume'

describe('Component', () => {
  it('should render components', () => {
    const wrapper = mount(EasePlayer, {
      props: {
        musicList: [],
        onClear: () => {},
      },
    })

    const btns = wrapper.findComponent(Btns)
    const list = wrapper.findComponent(List)
    const lyric = wrapper.findComponent(Lyric)
    const progress = wrapper.findComponent(Progress)
    const volume = wrapper.findComponent(Volume)

    expect(btns.exists()).toBeTruthy()
    expect(list.exists()).toBeTruthy()
    expect(lyric.exists()).toBeTruthy()
    expect(progress.exists()).toBeTruthy()
    expect(volume.exists()).toBeTruthy()
  })
})
