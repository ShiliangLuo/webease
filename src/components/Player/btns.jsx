import { defineComponent, toRefs } from 'vue';

const Btns = defineComponent({
  props: ['paused'],
  emits: ['play', 'change'],
  setup(props, { emit }) {
    const { paused } = toRefs(props);

    return () => (
      <div className="player-btns">
        <span className="aside-icon" onClick={() => emit('change', 'preview')}>
          <i className="el-icon-caret-left" />
        </span>
        <span className="play-icon" onClick={() => emit('play', paused.value)}>
          {paused.value ? (
            <i className="el-icon-video-play" />
          ) : (
            <i className="el-icon-video-pause" />
          )}
        </span>
        <span className="aside-icon" onClick={() => emit('change', 'next')}>
          <i className="el-icon-caret-right" />
        </span>
      </div>
    );
  },
});

export default Btns;
