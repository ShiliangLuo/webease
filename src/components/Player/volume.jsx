import { defineComponent, onMounted, ref, toRefs } from 'vue';
import { useDrag } from './useDrag';

const Volume = defineComponent({
  props: ['volume'],
  emits: ['click', 'change'],
  setup(props, { emit }) {
    const { volume } = toRefs(props);
    const volumeBar = ref(null);

    // 鼠标拖动
    const moveHandler = left => {
      if (left >= 100) left = 100;
      
      emit('change', left / 100)
    };

    onMounted(() => useDrag(volumeBar.value, moveHandler));

    return () => (
      <div className="player-volume">
        <div
          className="player-volume-icon pointer fl"
          onClick={() => emit('click')}
        >
          {volume.value !== 0 ? (
            <i className="iconfont icon-SOUNDPLUS" />
          ) : (
            <i className="iconfont icon-soundminus" />
          )}
        </div>

        <div className="player-volume-progress fl">
          <div
            className="player-volume-progress-bar"
            onClick={e =>
              e.target.nodeName.toLowerCase() === 'div' &&
              emit('change', e.offsetX / 100)
            }
          >
            <div
              className="player-volume-progress-al"
              style={{ width: volume.value * 100 + 'px' }}
            >
              <span
                className="player-volume-progress-dot"
                style={{ left: volume.value * 100 - 3 + 'px' }}
                ref={volumeBar}
              ></span>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default Volume;
