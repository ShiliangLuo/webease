import { defineComponent, toRefs } from 'vue';

const Btns = defineComponent({
  props: ['paused'],
  emits: ['play', 'change'],
  setup(props, { emit }) {
    const { paused } = toRefs(props);

    return () => (
      <div class="player-btns">
        <span class="aside-icon" onClick={() => emit('change', 'preview')}>
          <i class="el-icon-caret-left" />
        </span>
        <span class="play-icon" onClick={() => emit('play', paused.value)}>
          {paused.value ? (
            <i class="el-icon-video-play" />
          ) : (
            <i class="el-icon-video-pause" />
          )}
        </span>
        <span class="aside-icon" onClick={() => emit('change', 'next')}>
          <i class="el-icon-caret-right" />
        </span>
      </div>
    );
  },
});

export default Btns;
