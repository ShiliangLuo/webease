import { defineComponent, PropType } from 'vue'

const Btns = defineComponent({
  name: 'Btns',
  props: {
    paused: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    onPlay: {
      type: Function as PropType<(v: boolean) => void>,
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: 'preview' | 'next') => void>,
      required: true,
    },
  },
  emits: ['change', 'play'],
  setup(props, { emit }) {
    const playIcon = () => {
      if (props.paused) {
        return <i class="el-icon-video-play" />
      }
      return <i class="el-icon-video-pause" />
    }

    return () => {
      return (
        <div class="player-btns">
          <span class="aside-icon" onClick={() => emit('change', 'preview')}>
            <i class="el-icon-caret-left" />
          </span>
          <span class="play-icon" onClick={() => emit('play')}>
            {playIcon()}
          </span>
          <span class="aside-icon" onClick={() => emit('change', 'next')}>
            <i class="el-icon-caret-right" />
          </span>
        </div>
      )
    }
  },
})

export default Btns
