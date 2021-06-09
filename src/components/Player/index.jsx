import store from 'store';
import './style.less';

const audio = new Audio();
let timer = null;
let t = null;
audio.volume = 0.3;

// 设置audio的src并开始播放
function setSource(url, vm) {
  audio.src = url;
  play(paused => (vm.paused = paused), vm);
  // emit当前播放歌曲
  vm.$emit('update:current', vm.musicList[vm.currentIndex]);
}

// audio播放与暂停，并回调出当前状态
function play(cb, vm) {
  // 防止连续点击创建过多定时器，也可以用防抖
  clearInterval(timer);
  clearInterval(t);

  if (audio.paused) {
    audio.play().catch(e => console.log(e));

    // 播放时音量淡入
    audio.volume = 0;
    t = setInterval(() => {
      audio.volume += 0.05;
      if (audio.volume >= vm.oldVolume) {
        clearInterval(t);
      }
    }, 100);

    // 设置播放时间
    timer = setInterval(() => {
      vm.currentTime = audioCurrentTime();
      if (vm.currentTime === audio.duration) {
        cb && cb(audio.paused);
        clearInterval(timer);
      }
    }, 1000);

    // 回调出状态
    cb && cb(audio.paused);
  } else {
    // 暂停时音量淡出
    let v = audio.volume;
    t = setInterval(() => {
      v -= 0.05;
      if (v > 0) {
        audio.volume = v;
      } else {
        clearInterval(t);
        audio.pause();
      }
    }, 100);

    // 直接设置状态，防止点击暂停按钮时，等待一定时间才改变状态
    vm.paused = true;
  }

  // cb && cb(audio.paused);
}

// 设置/获取播放百分比
function audioCurrentTime(time) {
  time && (audio.currentTime = time);

  return audio.currentTime;
}

// 设置音量
function setVolume(volumn, vm) {
  vm.volume = vm.oldVolume = audio.volume = volumn;
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
    current: {
      type: Object,
      default: () => {},
    },
    musicList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      duration: 0,
      paused: true,
      currentTime: 0,
      volume: 0.3,
      oldVolume: 0.3,
      collapsed: true,
      currentIndex: 0,
    };
  },
  created() {
    audio.addEventListener('loadeddata', this.getDuration);
    audio.addEventListener('ended', this.playNext);
    audio.addEventListener('error', this.loadError);
  },
  computed: {
    getWidth() {
      return this.duration ? (this.currentTime / this.duration) * 400 : 0;
    },
  },
  watch: {
    musicList: function(val) {
      store.set('WEBEASELIST', val);
      if (val.length === 0) return;
      this.currentIndex = val.length - 1;
      setSource(
        `https://music.163.com/song/media/outer/url?id=${
          val[this.currentIndex].id
        }.mp3`,
        this
      );
    },
  },
  methods: {
    getDuration() {
      this.duration = audio.duration;
    },
    playNext() {
      this.currentTime = 0;
      this.musicList.length > 0 &&
        (this.currentIndex < this.musicList.length - 1
          ? this.currentIndex++
          : (this.currentIndex = 0),
        setSource(
          `https://music.163.com/song/media/outer/url?id=${
            this.musicList[this.currentIndex].id
          }.mp3`,
          this
        ));
    },
    playPrev() {
      this.currentTime = 0;
      this.musicList.length > 0 &&
        (this.currentIndex > 0
          ? this.currentIndex--
          : (this.currentIndex = this.musicList.length - 1),
        setSource(
          `https://music.163.com/song/media/outer/url?id=${
            this.musicList[this.currentIndex].id
          }.mp3`,
          this
        ));
    },
    // 资源加载错误
    loadError(e) {
      console.log('音乐加载错误：', e);
      this.playNext();
    },
  },
  render() {
    // 控制按钮
    const controlBtns = (
      <div class="player-btns">
        <span class="aside-icon" onClick={() => this.playPrev()}>
          <i class="el-icon-caret-left" />
        </span>
        <span
          class="play-icon"
          onClick={() => {
            audio.src
              ? play(paused => (this.paused = paused), this)
              : this.musicList.length > 0
              ? setSource(
                  `https://music.163.com/song/media/outer/url?id=${
                    this.musicList[this.currentIndex].id
                  }.mp3`,
                  this
                )
              : null;
          }}
        >
          {this.paused ? (
            <i class="el-icon-video-play" />
          ) : (
            <i class="el-icon-video-pause" />
          )}
        </span>
        <span class="aside-icon" onClick={() => this.playNext()}>
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
            this.volume !== 0
              ? (this.volume = audio.volume = 0)
              : setVolume(this.oldVolume, this)
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
            onClick={e =>
              e.target.nodeName.toLowerCase() === 'div' &&
              setVolume(e.offsetX / 100, this)
            }
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

    // 播放列表
    const playList = (
      <div class="player-list">
        <div
          class="collapse-btn pointer"
          onClick={() => (this.collapsed = !this.collapsed)}
        >
          {this.collapsed ? (
            <i class="el-icon-s-unfold" />
          ) : (
            <i class="el-icon-s-fold" />
          )}
        </div>

        <div
          class="player-list-container"
          style={{ right: this.collapsed ? '-300px' : 0 }}
        >
          <div class="player-list-clear">
            <span onClick={() => this.$emit('clear-store')}>清空列表</span>
          </div>
          <ul>
            {this.musicList.map((item, index) => {
              return (
                <li
                  class={
                    this.currentIndex === index && audio.src ? 'playing' : ''
                  }
                >
                  <div class="list-title">{item.name}</div>
                  <div class="list-time">{item.time}</div>
                  <div class="list-icon">
                    <i class="iconfont icon-SOUNDPLUS" />
                  </div>
                  <div class="list-delete">
                    <i
                      class="el-icon-circle-close"
                      onClick={() => this.$emit('clear-item', item.id)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );

    return (
      <div class="player" ref="playerContainer">
        <div class="player-main">
          {controlBtns}
          {progressBar}
          {volumnBar}
          {playList}
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
