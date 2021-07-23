import { LyricState } from '../../types'

export function useLyric(state: LyricState, audio: HTMLAudioElement) {
  if (!state.data) return

  state.lyricList = []
  state.currentLine = 0
  // 使用换行符\n拆分歌词
  const lyricArr = state.data.split('\n')

  audio.addEventListener('timeupdate', setLyric)

  lyricArr.forEach(item => {
    if (item.replace(/\[(.+?)\]/g, '')) {
      state.lyricList.push({
        time: lyricTimelineToSecond(item),
        content: item.replace(/\[(.+?)\]/g, ''),
      })
    }
  })

  // [00:29.28]格式转成秒数
  function lyricTimelineToSecond(timeline: string) {
    const time = timeline.replace(/\[(.+?)\]/g, (...args) => args[1])

    return (
      Number(time.split(':')[0]) * 60 +
      parseFloat(time.split(':')[1])
    ).toFixed(3)
  }

  // 设置当前歌词
  function setLyric() {
    if (!state.lyricList[state.currentLine]) return

    if (
      parseFloat(state.lyricList[state.currentLine].time) <= audio.currentTime
    ) {
      state.currentLine++

      if (state.currentLine >= state.lyricList.length - 1) {
        state.currentLine = state.lyricList.length - 1
      }
    }

    if (
      parseFloat(state.lyricList[state.currentLine].time) > audio.currentTime
    ) {
      state.currentLine--

      if (state.currentLine <= 0) {
        state.currentLine = 0
      }
    }
  }
}
