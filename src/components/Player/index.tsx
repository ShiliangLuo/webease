import store from 'store'
import {
  computed,
  defineComponent,
  reactive,
  watch,
  PropType,
  ComputedRef,
} from 'vue'
import { usePlay } from './usePlay'
import { MusicList, PlayerState } from '../../types'
import Btns from './btns'
import Progress from './progress'
import Volume from './volume'
import List from './list'
import Lyric from './lyric'
import './style.less'

const audio = new Audio()

const PlayerContainer = defineComponent({
  name: 'PlayerContainer',
  setup(props, { slots }) {
    return () => {
      return (
        <div class="player">
          <div class="player-main">{slots.default && slots.default()}</div>
        </div>
      )
    }
  },
})

const EasePlayer = defineComponent({
  name: 'EasePlayer',
  props: {
    musicList: {
      type: Array as PropType<MusicList[]>,
      required: true,
    },
    onClear: {
      type: Function as PropType<(id: number | undefined) => void>,
      required: true,
    },
  },
  setup(props) {
    const list: ComputedRef<MusicList[]> = computed(() => props.musicList)
    const state: PlayerState = reactive({
      paused: true,
      currentTime: 0,
      oldVolume: 0.3,
      currentIndex: 0,
      list,
    })

    const { play, switchMusic } = usePlay(state, audio)

    const watchHandler = (val: MusicList[]) => {
      store.set('WEBEASELIST', val)

      if (val.length === 0) return

      state.currentIndex = val.length - 1
      play(val[val.length - 1].outerUrl)
    }

    watch(() => props.musicList, watchHandler, { deep: true })

    const lyric = computed(() => {
      if (state.list && state.list.length > 0)
        return state.list[state.currentIndex].lyric

      return ''
    })

    const handlePlay = () => {
      audio.src ? play() : play(state.list[state.currentIndex].outerUrl)
    }

    const handleClear = (id?: number) => {
      props.onClear(id)
    }

    const handleListItemClick = (url: string, index: number) => {
      if (!audio.src) {
        play(url)
        state.currentIndex = index

        return
      }

      if (state.currentIndex === index) return

      play(url)
      state.currentIndex = index
      state.currentTime = 0
    }

    return () => {
      const { paused, currentIndex, list } = state
      const lyricData = lyric.value

      return (
        <PlayerContainer>
          <Btns
            paused={paused}
            onPlay={handlePlay}
            onChange={type => switchMusic(type)}
          />

          <Progress
            audio={audio}
            currentTime={state.currentTime}
            onChange={time => (state.currentTime = time)}
          />

          <Volume audio={audio} onChange={vol => (state.oldVolume = vol)} />

          <List
            data={list}
            currentIndex={currentIndex}
            audio={audio}
            onClick={handleListItemClick}
            onClear={id => handleClear(id)}
          />

          <Lyric data={lyricData} audio={audio} />
        </PlayerContainer>
      )
    }
  },
})

export default EasePlayer
