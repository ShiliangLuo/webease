export interface MusicList {
  url: string
  outerUrl: string
  id: number
  lyric: string
  name: string
  time: string
}

export interface PlayerState {
  paused: boolean
  currentTime: number
  oldVolume: number
  currentIndex: number
  list: MusicList[]
}

export interface ProgressState {
  duration: number
  width: number
  isDrag: boolean
}

export interface VolumeState {
  volume: number
  oldVolume: number
}

export type LyricItem = {
  time: string
  content: string
}

export interface LyricState {
  currentLine: number
  lyricList: LyricItem[]
  show: boolean
  data: string
}
