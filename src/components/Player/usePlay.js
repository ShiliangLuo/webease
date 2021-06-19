export function usePlay(state, audio) {
  let timer = null;
  let t = null;

  // 设置初始音量
  audio.volume = 0.3;

  // 设置audio的三个事件监听
  audio.addEventListener('loadeddata', () => {
    state.duration = audio.duration;
  });
  audio.addEventListener('ended', () => {
    switchMusic('next');
  });
  audio.addEventListener('error', err => {
    console.log('播放错误：', err);
  });

  // 设置音量
  function setVolume(vol) {
    state.volume = state.oldVolume = audio.volume = vol;
  }

  // 设置/获取播放百分比
  function audioCurrentTime(time) {
    time && (audio.currentTime = time);

    return audio.currentTime;
  }

  // 播放/暂停
  async function play(url) {
    if (state.length === 0) return;

    // 防止连续点击创建过多定时器
    clearInterval(timer);
    clearInterval(t);

    // 有参数，则赋值
    url && (audio.src = url);

    if (audio.paused) {
      try {
        await audio.play();
        state.paused = false;
      } catch (e) {
        console.log(e);
      }

      // 播放时音量淡入
      audio.volume = 0;
      t = setInterval(() => {
        audio.volume += 0.05;
        if (audio.volume >= state.oldVolume) {
          clearInterval(t);
        }
      }, 100);

      // 设置播放时间
      timer = setInterval(() => {
        state.currentTime = audioCurrentTime();
        if (audio.currentTime === audio.duration) {
          clearInterval(timer);
        }
      }, 1000);
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

      // 直接设置状态，防止点击暂停按钮时，按钮状态没有立即切换
      state.paused = true;
    }
  }

  // 上一首、下一首
  function switchMusic(type) {
    if (state.length === 0) return;

    state.currentTime = 0;

    if (type === 'preview') {
      // 上一首
      if (state.currentIndex > 0) {
        state.currentIndex--;
      } else {
        state.currentIndex = state.length - 1;
      }
    } else if (type === 'next') {
      // 下一首
      if (state.currentIndex < state.length - 1) {
        state.currentIndex++;
      } else {
        state.currentIndex = 0;
      }
    }

    play(
      `https://music.163.com/song/media/outer/url?id=${
        state.list[state.currentIndex].id
      }.mp3`
    );
  }

  return {
    audioCurrentTime,
    play,
    setVolume,
    switchMusic,
  };
}
