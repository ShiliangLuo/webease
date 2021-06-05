// import Player from './player';
import './style.less';

const audio = new Audio();
let timer = null;

// 设置audio的src并开始播放
function setSource(url, vm) {
  audio.src = url;
  play(paused => (vm.paused = paused), vm);
}

// audio播放与暂停，并回调出当前状态
function play(cb, vm) {
  // audio.paused ? audio.play().catch(e => console.log(e)) : audio.pause();
  if (audio.paused) {
    audio.play().catch(e => console.log(e));

    // 设置播放时间
    timer = setInterval(() => {
      vm.currentTime = audioCurrentTime();

      if (vm.currentTime === audio.duration) {
        cb && cb(audio.paused);
        clearInterval(timer);
      }
    }, 1000);
  } else {
    audio.pause();

    clearInterval(timer);
  }

  cb && cb(audio.paused);
}

// 设置/获取播放百分比
function audioCurrentTime(time) {
  time && (audio.currentTime = time);

  return audio.currentTime;
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
  },
  data() {
    return {
      duration: 0,
      paused: true,
      currentTime: 0,
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
    // 进度条
    const progressBar = (
      <div class="player-progress">
        <div class="time">00:00</div>
        <div class="player-progress-bar">
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

    return (
      <div class="player" ref="playerContainer">
        <div class="player-main">
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
          {progressBar}
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
