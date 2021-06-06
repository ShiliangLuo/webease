// import Player from './player';
import './style.less';

const audio = new Audio();
let timer = null;
audio.volume = 0.3;

// 设置audio的src并开始播放
function setSource(url, vm) {
  audio.src = url;
  play(paused => (vm.paused = paused), vm);
}

// audio播放与暂停，并回调出当前状态
function play(cb, vm) {
  clearInterval(timer);

  if (audio.paused) {
    audio.play().catch(e => console.log(e));

    // 设置播放时间
    vm.currentTime = 0;
    timer = setInterval(() => {
      vm.currentTime = audioCurrentTime();
      // console.log('buffered', audio.buffered.end(0));

      if (vm.currentTime === audio.duration) {
        cb && cb(audio.paused);
        // emit当前播放器状态
        vm.$emit('update:status', audio.paused);
        clearInterval(timer);
      }
    }, 1000);
  } else {
    audio.pause();
  }

  cb && cb(audio.paused);
  // emit当前播放器状态
  vm.$emit('update:status', audio.paused);
}

// 设置/获取播放百分比
function audioCurrentTime(time) {
  time && (audio.currentTime = time);

  return audio.currentTime;
}

// 设置音量
function setVolume(volumn, vm) {
  vm.volume = audio.volume = volumn;
}

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

const EasePlayer = {
  name: 'EasePlayer',
  props: {
    url: {
      type: String,
      default: '',
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      duration: 0,
      paused: true,
      currentTime: 0,
      volume: 0.3,
    };
  },
  created() {
    audio.addEventListener('loadeddata', this.getDuration);
  },
  destroyed() {
    audio.removeEventListener('loadeddata', this.getDuration);
  },
  computed: {
    getWidth() {
      return this.duration ? (this.currentTime / this.duration) * 400 : 0;
    },
  },
  watch: {
    url: function(val) {
      setSource(val, this);
    },
  },
  methods: {
    getDuration() {
      this.duration = audio.duration;
    },
  },
  render() {
    // 控制按钮
    const controlBtns = (
      <div class="player-btns">
        <span class="aside-icon">
          <i class="el-icon-caret-left" />
        </span>
        <span
          class="play-icon"
          onClick={() =>
            audio.src && play(paused => (this.paused = paused), this)
          }
        >
          {this.paused ? (
            <i class="el-icon-video-play" />
          ) : (
            <i class="el-icon-video-pause" />
          )}
        </span>
        <span class="aside-icon">
          <i class="el-icon-caret-right" />
        </span>
      </div>
    );

    // 进度条
    const progressBar = (
      <div class="player-progress">
        <div class="time">{timeToMinutes(this.currentTime)}</div>
        <div
          class="player-progress-bar"
          onClick={e =>
            this.paused
              ? audio.src && play(paused => (this.paused = paused), this)
              : audioCurrentTime((e.offsetX / 400) * this.duration)
          }
        >
          <div
            class="player-progress-al"
            style={{ width: this.getWidth + 'px' }}
          >
            <span
              class="player-progress-dot"
              style={{ left: this.getWidth - 3 + 'px' }}
            ></span>
          </div>
        </div>
        <div class="time">{timeToMinutes(this.duration)}</div>
      </div>
    );

    // 音量控制条
    const volumnBar = (
      <div class="player-volume">
        <div
          class="player-volume-icon pointer fl"
          onClick={() =>
            this.volume !== 0 ? setVolume(0, this) : setVolume(0.3, this)
          }
        >
          {this.volume !== 0 ? (
            <i class="iconfont icon-SOUNDPLUS" />
          ) : (
            <i class="iconfont icon-soundminus" />
          )}
        </div>

        <div class="player-volume-progress fl">
          <div
            class="player-volume-progress-bar"
            onClick={e => setVolume(e.offsetX / 100, this)}
          >
            <div
              class="player-volume-progress-al"
              style={{ width: this.volume * 100 + 'px' }}
            >
              <span
                class="player-volume-progress-dot"
                style={{ left: this.volume * 100 - 3 + 'px' }}
              ></span>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div class="player" ref="playerContainer">
        <div class="player-main">
          {controlBtns}
          {progressBar}
          {volumnBar}
        </div>
      </div>
    );
  },
};

// 暴露Vue插件接口
EasePlayer.install = function(Vue) {
  Vue.component(EasePlayer.name, EasePlayer);
};

export default EasePlayer;
