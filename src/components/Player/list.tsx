import { defineComponent, Ref, PropType, ref, Transition } from 'vue'
import { MusicList } from '@/types'

const List = defineComponent({
  name: 'List',
  props: {
    data: {
      type: Array as PropType<MusicList[]>,
      required: true,
    },
    currentIndex: {
      type: Number as PropType<number>,
      required: true,
    },
    audio: {
      type: Object as PropType<HTMLAudioElement>,
      required: true,
    },
    onClear: {
      type: Function as PropType<(id: number | undefined) => void>,
      required: true,
    },
    onClick: {
      type: Function as PropType<(id: number, index: number) => void>,
      required: true,
    },
  },
  setup(props) {
    const collapsed: Ref<boolean> = ref(true)

    const handleClear = (id?: number) => {
      props.onClear(id)
    }

    const handleListItemClick = (id: number, index: number) => {
      props.onClick(id, index)
    }

    return () => {
      const { data, currentIndex, audio } = props

      return (
        <div class="player-list">
          <div
            class="collapse-btn pointer"
            onClick={() => (collapsed.value = !collapsed.value)}
          >
            {collapsed.value ? (
              <i class="el-icon-s-unfold" />
            ) : (
              <i class="el-icon-s-fold" />
            )}
          </div>

          <div
            class="player-list-container"
            style={{ right: collapsed.value ? '-300px' : 0 }}
          >
            <div class="player-list-clear">
              <span onClick={() => handleClear()}>清空列表</span>
            </div>
            <ul>
              {data.map((item, index) => {
                return (
                  <li
                    class={currentIndex === index && audio.src ? 'playing' : ''}
                  >
                    <div
                      class="list-title"
                      onClick={() => handleListItemClick(item.id, index)}
                    >
                      {item.name}
                    </div>
                    <div class="list-time">{item.time}</div>
                    <div class="list-icon">
                      <i class="iconfont icon-SOUNDPLUS" />
                    </div>
                    <div class="list-delete">
                      <i
                        class="el-icon-circle-close"
                        onClick={() => handleClear(item.id)}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )
    }
  },
})

export default List
