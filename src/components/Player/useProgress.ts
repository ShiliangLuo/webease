import { ProgressState } from '../../types'

export function useProgress(
  state: ProgressState,
  audio: HTMLAudioElement,
  cb: (time: number) => void,
) {
  audio.addEventListener('loadeddata', () => {
    state.duration = audio.duration
  })

  // 鼠标拖动
  function moveHandler(left: number) {
    state.isDrag = true

    if (left >= 400) left = 400

    state.width = left
  }

  // 鼠标松开
  function upHandler() {
    const current = (state.width / 400) * state.duration

    if (!state.isDrag) return

    if (audio.paused) {
      audio.src && audio.play()
    } else {
      audio.currentTime = current

      cb(current)
    }

    state.isDrag = false
  }

  // 点击进度条
  function handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement

    if (target.nodeName.toLowerCase() === 'div') {
      const current = (e.offsetX / 400) * state.duration

      audio.currentTime = current
      cb(current)
    }
  }

  return { moveHandler, upHandler, handleClick }
}
