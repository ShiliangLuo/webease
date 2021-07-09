import {
  computed,
  defineComponent,
  onMounted,
  ref,
  PropType,
  Ref,
  reactive,
} from 'vue'
import { useDrag } from './useDrag'
import { useProgress } from './useProgress'
import { ProgressState } from '../../types'

// 秒数转mm:ss格式
const timeToMinutes = (time: number) => {
  if (!time) return '00:00'

  let second: string | number
  let minute: string | number

  let s = Math.floor(time) % 60
  let m = Math.floor(time / 60)

  second = s < 10 ? '0' + s : s
  minute = m < 10 ? '0' + m : m

  return `${minute}:${second}`
}

const Progress = defineComponent({
  name: 'Progress',
  props: {
    audio: {
      type: Object as PropType<HTMLAudioElement>,
      required: true,
    },
    currentTime: {
      type: Number as PropType<number>,
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: number) => void>,
      required: true,
    },
  },
  setup(props) {
    const state: ProgressState = reactive({
      duration: 0,
      width: 0,
      isDrag: false,
    })

    const { moveHandler, upHandler, handleClick } = useProgress(
      state,
      props.audio,
      props.onChange,
    )

    const progressBar: Ref<HTMLElement | null> = ref(null)

    const getWidth = computed(() => {
      if (state.isDrag) return state.width

      return state.duration ? (props.currentTime / state.duration) * 400 : 0
    })

    onMounted(() =>
      useDrag(progressBar.value as HTMLElement, moveHandler, upHandler),
    )

    return () => {
      const width = getWidth.value
      const { currentTime } = props

      return (
        <div class="player-progress">
          <div class="time">{timeToMinutes(currentTime)}</div>
          <div class="player-progress-bar" onClick={handleClick}>
            <div class="player-progress-al" style={{ width: width + 'px' }}>
              <span
                class="player-progress-dot"
                style={{ left: width - 3 + 'px' }}
                ref={progressBar}
              ></span>
            </div>
          </div>
          <div class="time">{timeToMinutes(state.duration)}</div>
        </div>
      )
    }
  },
})

export default Progress
