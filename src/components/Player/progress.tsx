import {
  computed,
  defineComponent,
  onMounted,
  ref,
  toRefs,
  PropType,
  Ref,
} from 'vue'
import { useDrag } from './useDrag'

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
  props: {
    currentTime: {
      type: Number as PropType<number>,
      required: true,
    },
    duration: {
      type: Number as PropType<number>,
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: number) => void>,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const { currentTime, duration } = toRefs(props)
    const width = ref(0) // 定义拖动时的宽度
    const isDrag = ref(false)

    const getWidth = computed(() => {
      if (isDrag.value) return width.value

      return duration.value ? (currentTime.value / duration.value) * 400 : 0
    })

    const progressBar: Ref<HTMLElement | null> = ref(null)

    // 鼠标拖动
    const moveHandler = (left: number) => {
      isDrag.value = true

      if (left >= 400) left = 400

      width.value = left
    }

    // 鼠标松开
    const upHandler = () => {
      isDrag.value = false
      emit('change', (width.value / 400) * duration.value)
    }

    onMounted(() =>
      useDrag(progressBar.value as HTMLElement, moveHandler, upHandler),
    )

    return () => (
      <div class="player-progress">
        <div class="time">{timeToMinutes(currentTime.value)}</div>
        <div
          class="player-progress-bar"
          onClick={(e: any) =>
            e.target.nodeName.toLowerCase() === 'div' &&
            emit('change', (e.offsetX / 400) * duration.value)
          }
        >
          <div
            class="player-progress-al"
            style={{ width: getWidth.value + 'px' }}
          >
            <span
              class="player-progress-dot"
              style={{ left: getWidth.value - 3 + 'px' }}
              ref={progressBar}
            ></span>
          </div>
        </div>
        <div class="time">{timeToMinutes(duration.value)}</div>
      </div>
    )
  },
})

export default Progress
