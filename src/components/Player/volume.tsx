import { defineComponent, onMounted, ref, PropType, Ref, reactive } from 'vue'
import { useDrag } from './useDrag'
import { useVolume } from './useVolume'
import { VolumeState } from '../../types'

const Volume = defineComponent({
  name: 'Volume',
  props: {
    audio: {
      type: Object as PropType<HTMLAudioElement>,
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: number) => void>,
      required: true,
    },
  },
  setup(props) {
    const volumeBar: Ref<HTMLElement | null> = ref(null)
    const state: VolumeState = reactive({
      volume: 0.3,
      oldVolume: 0.3,
    })

    const { setVolume } = useVolume(state, props.audio)

    // 鼠标拖动
    const moveHandler = (left: number) => {
      if (left >= 100) left = 100

      setVolume(left / 100)

      props.onChange(left / 100)
    }

    // 直接点击音量条
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (target.nodeName.toLowerCase() === 'div') {
        setVolume(e.offsetX / 100)

        props.onChange(e.offsetX / 100)
      }
    }

    // 静音
    const handleSwitch = () => {
      if (state.volume !== 0) {
        state.volume = props.audio.volume = 0
      } else {
        setVolume(state.oldVolume)
      }
    }

    onMounted(() => useDrag(volumeBar.value as HTMLElement, moveHandler))

    return () => {
      return (
        <div class="player-volume">
          <div class="player-volume-icon pointer fl" onClick={handleSwitch}>
            {state.volume !== 0 ? (
              <i class="iconfont icon-SOUNDPLUS" />
            ) : (
              <i class="iconfont icon-soundminus" />
            )}
          </div>

          <div class="player-volume-progress fl">
            <div class="player-volume-progress-bar" onClick={handleClick}>
              <div
                class="player-volume-progress-al"
                style={{ width: state.volume * 100 + 'px' }}
              >
                <span
                  class="player-volume-progress-dot"
                  style={{ left: state.volume * 100 - 3 + 'px' }}
                  ref={volumeBar}
                ></span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  },
})

export default Volume
