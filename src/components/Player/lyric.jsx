import { defineComponent, reactive, toRefs, watch } from 'vue';
import { useLyric } from './useLyric';

const Lyric = defineComponent({
  props: ['data', 'audio'],
  setup(props) {
    const { data, audio } = toRefs(props);
    const options = reactive({
      currentLine: 0,
      lyricList: [],
      show: false,
      data,
      audio,
    });

    watch(
      data,
      () => {
        useLyric(options);
      },
      {
        immediate: true,
      }
    );

    return () => (
      <div class="player-lyric-container">
        <div
          class={['player-lyric-switch', options.show ? 'on' : null]}
          onClick={() => (options.show = !options.show)}
        >
          词
        </div>

        <div
          class="player-lyric"
          style={{ display: options.show ? 'block' : 'none' }}
        >
          <div
            class="player-lyric-list"
            style={{
              transform: `translateY(${-40 * options.currentLine + 30}px)`,
            }}
          >
            <ul>
              {options.lyricList.map((item, index) => {
                return (
                  <li class={{ current: index === options.currentLine }}>
                    {item.content}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  },
});

export default Lyric;
