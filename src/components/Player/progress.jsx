import { computed, defineComponent, toRefs } from 'vue';

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
    const getWidth = computed(() => {
      return duration.value ? (currentTime.value / duration.value) * 400 : 0;
    });

    return () => (
      <div class="player-progress">
        <div class="time">{timeToMinutes(currentTime.value)}</div>
        <div
          class="player-progress-bar"
          onClick={e =>
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
            ></span>
          </div>
        </div>
        <div class="time">{timeToMinutes(duration.value)}</div>
      </div>
    );
  },
});

export default Progress;
