import { defineComponent, onMounted, ref, toRefs, PropType, Ref } from 'vue'
import { useDrag } from './useDrag'

const Volume = defineComponent({
  props: {
    volume: {
      type: Number as PropType<number>,
      required: true,
    },
    onClick: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: number) => void>,
      required: true,
    },
  },
  emits: ['click', 'change'],
  setup(props, { emit }) {
    const { volume } = toRefs(props)
    const volumeBar: Ref<HTMLElement | null> = ref(null)

    // 鼠标拖动
    const moveHandler = (left: number) => {
      if (left >= 100) left = 100

      emit('change', left / 100)
    }

    onMounted(() => useDrag(volumeBar.value as HTMLElement, moveHandler))

    return () => (
      <div class="player-volume">
        <div
          class="player-volume-icon pointer fl"
          onClick={() => emit('click')}
        >
          {volume.value !== 0 ? (
            <i class="iconfont icon-SOUNDPLUS" />
          ) : (
            <i class="iconfont icon-soundminus" />
          )}
        </div>

        <div class="player-volume-progress fl">
          <div
            class="player-volume-progress-bar"
            onClick={(e: any) =>
              e.target.nodeName.toLowerCase() === 'div' &&
              emit('change', e.offsetX / 100)
            }
          >
            <div
              class="player-volume-progress-al"
              style={{ width: volume.value * 100 + 'px' }}
            >
              <span
                class="player-volume-progress-dot"
                style={{ left: volume.value * 100 - 3 + 'px' }}
                ref={volumeBar}
              ></span>
            </div>
          </div>
        </div>
      </div>
    )
  },
})

export default Volume