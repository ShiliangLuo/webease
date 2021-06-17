import store from 'store';
import { computed, defineComponent, reactive, toRefs, watch } from 'vue';
import { usePlay } from './usePlay';
import Btns from './btns';
import Progress from './progress';
import Volume from './volume';
import List from './list';
import './style.less';

const audio = new Audio();

const EasePlayer = defineComponent({
  name: 'EasePlayer',
  props: {
    musicList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['clear-item'],
  setup(props) {
    const { musicList } = toRefs(props);
    const options = reactive({
      duration: 0,
      paused: true,
      currentTime: 0,
      volume: 0.3,
      oldVolume: 0.3,
      collapsed: true,
      currentIndex: 0,
      length: computed(() => musicList.value.length),
      list: computed(() => musicList.value),
    });

    const { audioCurrentTime, play, setVolume, switchMusic } = usePlay(
      options,
      audio
    );

    const watchHandler = val => {
      store.set('WEBEASELIST', val);

      if (val.length === 0) return;

      options.currentIndex = val.length - 1;
      play(
        `https://music.163.com/song/media/outer/url?id=${
          val[val.length - 1].id
        }.mp3`
      );
    };

    watch(musicList, watchHandler, {
      deep: true,
    });

    return {
      ...toRefs(options),
      audioCurrentTime,
      play,
      setVolume,
      switchMusic,
    };
  },
  render() {
    return (
      <div class="player">
        <div class="player-main">
          <Btns
            paused={this.paused}
            onPlay={() => {
              audio.src
                ? this.play()
                : this.play(
                    `https://music.163.com/song/media/outer/url?id=${
                      this.musicList[this.currentIndex].id
                    }.mp3`
                  );
            }}
            onChange={type => this.switchMusic(type)}
          />

          <Progress
            currentTime={this.currentTime}
            duration={this.duration}
            onChange={time => {
              this.paused
                ? audio.src && this.play()
                : this.audioCurrentTime(time);
            }}
          />

          <Volume
            volume={this.volume}
            onClick={() =>
              this.volume !== 0
                ? (this.volume = audio.volume = 0)
                : this.setVolume(this.oldVolume)
            }
            onChange={vol => this.setVolume(vol)}
          />

          <List
            data={this.musicList}
            collapsed={this.collapsed}
            currentIndex={this.currentIndex}
            source={audio.src}
            onClick={(id, index) => {
              !audio.src &&
                this.play(
                  `https://music.163.com/song/media/outer/url?id=${id}.mp3`
                );

              if (this.currentIndex === index) return;

              this.currentIndex = index;
              this.currentTime = 0;
              this.play(
                `https://music.163.com/song/media/outer/url?id=${id}.mp3`
              );
            }}
            onShow={() => (this.collapsed = !this.collapsed)}
            onClearStore={() => this.$emit('clear-store')}
            onClearItem={id => this.$emit('clear-item', id)}
          />
        </div>
      </div>
    );
  },
});

// 暴露Vue插件接口
EasePlayer.install = function(Vue) {
  Vue.component(EasePlayer.name, EasePlayer);
};

export default EasePlayer;
