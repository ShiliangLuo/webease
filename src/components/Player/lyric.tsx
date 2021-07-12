import { defineComponent, PropType, reactive, toRefs, watch } from 'vue'
import { useLyric } from './useLyric'
import { LyricState } from '../../types'

const Lyric = defineComponent({
  name: 'Lyric',
  props: {
    data: {
      type: String as PropType<string>,
      required: true,
    },
    audio: {
      type: Object as PropType<HTMLAudioElement>,
      required: true,
    },
  },
  setup(props) {
    const { data } = toRefs(props)
    const state: LyricState = reactive({
      currentLine: 0,
      lyricList: [],
      show: false,
      data,
    })

    watch(
      () => props.data,
      () => {
        useLyric(state, props.audio)
      },
      {
        immediate: true,
      },
    )

    return () => {
      return (
        <div class="player-lyric-container">
          <div
            class={`player-lyric-switch ${state.show ? 'on' : ''}`}
            onClick={() => props.audio.src && (state.show = !state.show)}
          >
            词
          </div>

          <div
            class="player-lyric"
            style={{ display: state.show ? 'block' : 'none' }}
          >
            <div
              class="player-lyric-list"
              style={{
                transform: `translateY(${-40 * state.currentLine + 30}px)`,
              }}
            >
              <ul>
                {state.lyricList.map((item, index) => {
                  return (
                    <li class={index === state.currentLine ? 'current' : null}>
                      {item.content}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      )
    }
  },
})

export default Lyric
