import { VolumeState } from '../../types'

export function useVolume(state: VolumeState, audio: HTMLAudioElement) {
  // 设置初始音量
  audio.volume = state.volume

  // 设置音量
  function setVolume(volume: number) {
    state.volume = state.oldVolume = audio.volume = volume
  }

  return { setVolume }
}

// TODO 音量淡入淡出效果
export function volumeFade(volume: number, audio: HTMLAudioElement) {
  let timer: any
  // 播放时音量淡入
  function volumeFadeIn() {
    clearInterval(timer)

    audio.volume = 0
    timer = setInterval(() => {
      audio.volume += 0.05
      if (audio.volume >= volume) {
        clearInterval(timer)
      }
    }, 100)
  }

  // 暂停时音量淡出
  function volumeFadeOut() {
    clearInterval(timer)

    let v = audio.volume
    timer = setInterval(() => {
      v -= 0.05
      if (v > 0) {
        audio.volume = v
      } else {
        clearInterval(timer)
        audio.pause()
      }
    }, 100)
  }

  return { volumeFadeIn, volumeFadeOut }
}
