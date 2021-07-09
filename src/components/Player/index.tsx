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
      play(
        `https://music.163.com/song/media/outer/url?id=${
          val[val.length - 1].id
        }.mp3`,
      )
    }

    watch(list, watchHandler, {
      deep: true,
    })

    const lyric = computed(() => {
      if (state.list && state.list.length > 0)
        return state.list[state.currentIndex].lyric

      return ''
    })

    const handlePlay = () => {
      if (audio.src) {
        play()
      } else {
        play(
          `https://music.163.com/song/media/outer/url?id=${
            list.value[state.currentIndex].id
          }.mp3`,
        )
      }
    }

    const handleClear = (id?: number) => {
      props.onClear(id)
    }

    const handleListItemClick = (id: number, index: number) => {
      if (!audio.src) {
        play(`https://music.163.com/song/media/outer/url?id=${id}.mp3`)
        state.currentIndex = index

        return
      }

      if (state.currentIndex === index) return

      play(`https://music.163.com/song/media/outer/url?id=${id}.mp3`)
      state.currentIndex = index
      state.currentTime = 0
    }

    return () => {
      const { paused, currentIndex, list } = state
      const lyricData = lyric.value

      return (
        <div class="player">
          <div class="player-main">
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
          </div>
        </div>
      )
    }
  },
})

// 暴露Vue插件接口
EasePlayer.install = function(Vue: any) {
  Vue.component(EasePlayer.name, EasePlayer)
}

export default EasePlayer
