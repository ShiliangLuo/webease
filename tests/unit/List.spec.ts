import { mount } from '@vue/test-utils'
import List from '@/components/Player/list'
import { MusicList } from '@/types'

describe('List', () => {
  let props: any
  const listItem: MusicList = {
    id: 1,
    name: '测试',
    url: 'url',
    outerUrl: 'outerUrl',
    lyric: 'lyric',
    time: '05:05',
  }

  beforeEach(() => {
    props = {
      data: [],
      currentIndex: 0,
      audio: new Audio(),
      onClear: () => {},
      onClick: () => {},
    }
  })

  it('should not render li element', () => {
    const wrapper = mount(List, { props })
    const lis = wrapper.findAll('.player-list-container li')

    expect(lis.length).toBe(0)
  })

  it('should emit click event', () => {
    const wrapper = mount(List, { props: { ...props, data: [listItem] } })
    const title = wrapper.find('.player-list-container .list-title')

    title.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('should call props.onClear', () => {
    const fn = jest.fn()
    const onClear = () => fn()
    const wrapper = mount(List, { props: { ...props, onClear } })
    const clearIcon = wrapper.find('.player-list-clear span')

    clearIcon.trigger('click')
    expect(fn).toHaveBeenCalled()
  })

  it('should call props.onClear', () => {
    const fn = jest.fn()
    const onClear = () => fn()
    const wrapper = mount(List, {
      props: { ...props, onClear, data: [listItem] },
    })
    const clearIcon = wrapper.find(
      '.player-list-container .el-icon-circle-close',
    )

    clearIcon.trigger('click')
    expect(fn).toHaveBeenCalled()
  })

  it('should render "<i class="el-icon-s-unfold" />"', async () => {
    const wrapper = mount(List, { props })
    const collapseIcon = wrapper.find('.collapse-btn')

    await collapseIcon.trigger('click')
    const unfoldIcon = wrapper.find('.el-icon-s-unfold')
    expect(unfoldIcon.exists()).toBeTruthy()
  })

  it('should have "playing" class', async () => {
    props.audio.src = 'test'

    const wrapper = mount(List, {
      props: { ...props, data: [listItem], currentIndex: 0 },
    })
    const li0 = wrapper.find('.player-list-container li')

    expect(li0.classes().includes('playing')).toBeTruthy()
  })
})
