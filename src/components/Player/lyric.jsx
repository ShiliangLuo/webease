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
      <div className="player-lyric-container">
        <div
          className={`player-lyric-switch ${options.show ? 'on' : ''}`}
          onClick={() => (options.show = !options.show)}
        >
          词
        </div>

        <div
          className="player-lyric"
          style={{ display: options.show ? 'block' : 'none' }}
        >
          <div
            className="player-lyric-list"
            style={{
              transform: `translateY(${-40 * options.currentLine + 30}px)`,
            }}
          >
            <ul>
              {options.lyricList.map((item, index) => {
                return (
                  <li
                    className={index === options.currentLine ? 'current' : null}
                  >
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
