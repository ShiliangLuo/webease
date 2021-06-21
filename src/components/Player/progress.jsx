import { computed, defineComponent, onMounted, ref, toRefs } from 'vue';
import { useDrag } from './useDrag';

// 秒数转mm:ss格式
const timeToMinutes = time => {
  if (!time) return '00:00';

  let second = '';
  let minute = '';
  let s = Math.floor(time) % 60;
  let m = Math.floor(time / 60);

  second = s < 10 ? '0' + s : s;
  minute = m < 10 ? '0' + m : m;

  return `${minute}:${second}`;
};

const Progress = defineComponent({
  props: ['currentTime', 'duration'],
  emits: ['change'],
  setup(props, { emit }) {
    const { currentTime, duration } = toRefs(props);
    const width = ref(0); // 定义拖动时的宽度
    const isDrag = ref(false);

    const getWidth = computed(() => {
      if (isDrag.value) return width.value;

      return duration.value ? (currentTime.value / duration.value) * 400 : 0;
    });

    const progressBar = ref(null);

    // 鼠标拖动
    const moveHandler = left => {
      isDrag.value = true;

      if (left >= 400) left = 400;

      width.value = left;
    };

    // 鼠标松开
    const upHandler = () => {
      isDrag.value = false;
      emit('change', (width.value / 400) * duration.value);
    };

    onMounted(() => useDrag(progressBar.value, moveHandler, upHandler));

    return () => (
      <div className="player-progress">
        <div className="time">{timeToMinutes(currentTime.value)}</div>
        <div
          className="player-progress-bar"
          onClick={e =>
            e.target.nodeName.toLowerCase() === 'div' &&
            emit('change', (e.offsetX / 400) * duration.value)
          }
        >
          <div
            className="player-progress-al"
            style={{ width: getWidth.value + 'px' }}
          >
            <span
              className="player-progress-dot"
              style={{ left: getWidth.value - 3 + 'px' }}
              ref={progressBar}
            ></span>
          </div>
        </div>
        <div className="time">{timeToMinutes(duration.value)}</div>
      </div>
    );
  },
});

export default Progress;
