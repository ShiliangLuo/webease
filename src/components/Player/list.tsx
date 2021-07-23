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
      type: Function as PropType<(url: string, index: number) => void>,
      required: true,
    },
  },
  setup(props) {
    const collapsedRef: Ref<boolean> = ref(true)

    const handleClear = (id?: number) => {
      props.onClear(id)
    }

    const handleListItemClick = (url: string, index: number) => {
      props.onClick(url, index)
    }

    const toggleCollapse = () => (collapsedRef.value = !collapsedRef.value)

    const collapseIcon = () => {
      if (collapsedRef.value) {
        return <i class="el-icon-s-fold" />
      }

      return <i class="el-icon-s-unfold" />
    }

    return () => {
      const { data, currentIndex, audio } = props

      return (
        <div class="player-list">
          <div class="collapse-btn pointer" onClick={toggleCollapse}>
            {collapseIcon()}
          </div>

          <Transition name="list-slide">
            <div class="player-list-container" v-show={collapsedRef.value}>
              <div class="player-list-clear">
                <span onClick={() => handleClear()}>清空列表</span>
              </div>
              <ul>
                {data.map((item, index) => {
                  return (
                    <li
                      class={
                        currentIndex === index && audio.src ? 'playing' : ''
                      }
                      key={item.id}
                    >
                      <div
                        class="list-title"
                        onClick={() =>
                          handleListItemClick(item.outerUrl, index)
                        }
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
          </Transition>
        </div>
      )
    }
  },
})

export default List
