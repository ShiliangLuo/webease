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
          @current-change="handleCurrentChange"
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
import { defineComponent } from 'vue'
import SearchEmpty from '@/components/SearchEmpty'
import EasePlayer from '@/components/Player/index'
import { search, song, check, lyric } from '@/api/index'
import store from 'store'

export default defineComponent({
  name: 'Home',
  data() {
    return {
      tableData: [] as any[],
      total: 0,
      postJson: {
        keywords: '',
        offset: 1,
        limit: 10,
      },
      id: '',
      list: [] as any[],
    }
  },
  components: {
    SearchEmpty,
    EasePlayer,
  },
  created() {
    // 加载本地数据
    store.get('WEBEASELIST') && (this.list = store.get('WEBEASELIST'))
  },
  methods: {
    searchMusic() {
      if (!this.postJson.keywords) return
      this.postJson.offset = 1
      this.getList()
    },
    getList() {
      search(this.postJson)
        .then((res: any) => {
          console.log(res)
          this.tableData = res.result.songs
          this.total = res.result.songCount
        })
        .catch(err => {
          console.log(err)
        })
    },
    async playItem(row: any) {
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
            this.tableData.forEach((item: any) => {
              if (item.id === row.id) {
                name =
                  item.alias.length > 0
                    ? `${item.name}/${item.alias[0]}`
                    : `${item.name}`
                time = this.timeToMinutes(item.duration)
              }
            })

            this.list.every((item: any) => item.id !== row.id) &&
              this.list.push({
                url: response.data[0].url,
                name,
                id: row.id,
                time,
                lyric: lyrics.lrc.lyric,
              })
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    clear(id?: number) {
      if (id) {
        this.list = this.list.filter((item: any) => item.id !== id)
      } else {
        this.list = []
        store.remove('WEBEASELIST')
      }
    },
    handleCurrentChange() {
      this.getList()
    },
    timeToMinutes(time: number) {
      if (!time) return '00:00'

      let second: string | number
      let minute: string | number
      let s = Math.floor(time / 1000) % 60
      let m = Math.floor(time / 1000 / 60)

      second = s < 10 ? '0' + s : s
      minute = m < 10 ? '0' + m : m

      return `${minute}:${second}`
    },
  },
})
</script>

<style lang="less" scoped>
@import url('./style.less');
</style>
