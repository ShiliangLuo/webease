<template>
  <div class="container">
    <div class="main">
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入关键字搜索"
            suffix-icon="el-icon-search"
            v-model="postJson.keywords"
            @change="searchMusic"
          />
        </el-col>
      </el-row>

      <el-table
        :data="tableData"
        tooltip-effect="dark"
        style="margin-top: 30px;"
      >
        <template #empty>
          <SearchEmpty />
        </template>
        <el-table-column label="序号" width="60" type="index" />
        <el-table-column prop="name" label="音乐标题" show-overflow-tooltip>
          <template v-slot="record">
            <span class="pointer" @click="playItem(record.row)">
              {{ record.row.name }}
            </span>
            <span class="ft-12" style="margin-left: 10px;">
              {{ record.row.alias[0] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="artists[0].name" label="歌手" />
        <el-table-column prop="album.name" label="专辑" show-overflow-tooltip />
        <el-table-column prop="duration" label="时长" width="100">
          <template v-slot="record">
            {{ timeToMinutes(record.row.duration) }}
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 30px;">
        <el-pagination
          @current-change="getList"
          v-model:currentPage="postJson.offset"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="total"
        />
      </div>
    </div>
    <ease-player :music-list="list" @clear="clear" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, Ref, ref } from 'vue'
import SearchEmpty from '@/components/SearchEmpty'
import EasePlayer from '@/components/Player/index'
import { search, song, check, lyric } from '@/api/index'
import store from 'store'
import { MusicList } from '@/types'

export default defineComponent({
  name: 'Home',
  setup() {
    const tableData = ref([])
    const total = ref(0)
    const list: Ref<MusicList[]> = ref([])
    const postJson = reactive({
      keywords: '',
      offset: 1,
      limit: 10,
    })

    const getList = async () => {
      const res = await search(postJson).catch(err => console.log(err))

      console.log(res)
      tableData.value = res.result.songs
      total.value = res.result.songCount
    }

    const searchMusic = () => {
      if (!postJson.keywords) return

      postJson.offset = 1
      getList()
    }

    const playItem = async (row: any) => {
      try {
        const isAvailable = await check({ id: row.id })

        if (isAvailable.success) {
          const [response, lyrics] = await Promise.all([
            song({ id: row.id }),
            lyric({ id: row.id }),
          ])

          if (response) {
            let name = ''
            let time = ''
            tableData.value.forEach((item: any) => {
              if (item.id === row.id) {
                name =
                  item.alias.length > 0
                    ? `${item.name}/${item.alias[0]}`
                    : `${item.name}`
                time = timeToMinutes(item.duration)
              }
            })

            const isNoExist = list.value.every(item => item.id !== row.id)

            if (isNoExist) {
              list.value.push({
                url: response.data[0].url,
                name,
                id: row.id,
                time,
                lyric: lyrics.lrc.lyric,
                outerUrl: `https://music.163.com/song/media/outer/url?id=${row.id}.mp3`,
              })

              store.set('WEBEASELIST', list.value)
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    }

    const clear = (id?: number) => {
      if (id) {
        list.value = list.value.filter(item => item.id !== id)
      } else {
        list.value = []
        store.remove('WEBEASELIST')
      }
    }

    function timeToMinutes(time: number) {
      if (!time) return '00:00'

      let second: string | number
      let minute: string | number
      let s = Math.floor(time / 1000) % 60
      let m = Math.floor(time / 1000 / 60)

      second = s < 10 ? '0' + s : s
      minute = m < 10 ? '0' + m : m

      return `${minute}:${second}`
    }

    onBeforeMount(() => {
      // 加载本地数据
      store.get('WEBEASELIST') && (list.value = store.get('WEBEASELIST'))
    })

    return {
      tableData,
      total,
      list,
      postJson,
      getList,
      searchMusic,
      playItem,
      timeToMinutes,
      clear,
    }
  },
  components: {
    SearchEmpty,
    EasePlayer,
  },
})
</script>

<style lang="less" scoped>
@import url('./style.less');
</style>
