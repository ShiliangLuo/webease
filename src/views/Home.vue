<template>
  <div class="container">
    <div class="main">
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入关键字搜索"
            suffix-icon="el-icon-search"
            v-model="postJson.keywords"
            @change="getList"
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
            <span class="pointer color-blue" @click="playItem(record.row)">
              {{ record.row.name }}
            </span>
            <span class="color-gray ft-12" style="margin-left: 10px;">
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
        <el-table-column prop="operation" width="100">
          <template v-slot="record">
            <i
              class="el-icon-video-play table-play-btn"
              v-if="currentStatus"
              @click="playItem(record.row)"
            />
            <i
              class="el-icon-video-pause table-play-btn"
              v-else
              @click="playItem(record.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 30px;">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="postJson.offset"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="total"
        />
      </div>
    </div>
    <ease-player :url="url" :status.sync="currentStatus"></ease-player>
  </div>
</template>

<script>
import SearchEmpty from '@/components/SearchEmpty';
import EasePlayer from '@/components/Player/index';
import { search, song, check } from '@/api/index';

export default {
  name: 'Home',
  data() {
    return {
      tableData: [],
      total: 0,
      postJson: {
        keywords: '',
        offset: 1,
        limit: 10,
      },
      url: '',
      currentStatus: true,
      id: '',
    };
  },
  components: {
    SearchEmpty,
    EasePlayer,
  },
  methods: {
    getList() {
      if (!this.postJson.keywords) return;

      search(this.postJson)
        .then(res => {
          console.log(res);
          this.tableData = res.result.songs;
          this.total = res.result.songCount;

          this.tableData.forEach(item => {
            item.paused = true;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    async playItem(row) {
      this.id = row.id;
      try {
        const isAvailable = await check({ id: row.id });

        if (isAvailable.success) {
          const response = await song({ id: row.id });
          console.log('response', response);

          if (response) {
            this.url = response.data[0].url;
          }
        } else {
          this.$message.error('歌曲不可用！')
        }
      } catch (e) {
        console.log(e);
      }
    },
    handleCurrentChange() {
      this.getList();
    },
    timeToMinutes(time) {
      if (!time) return '00:00';

      let second = '';
      let minute = '';
      let s = Math.floor(time / 1000) % 60;
      let m = Math.floor(time / 1000 / 60);

      second = s < 10 ? '0' + s : s;
      minute = m < 10 ? '0' + m : m;

      return `${minute}:${second}`;
    },
  },
  watch: {
    // 监听当前播放器状态，更新列表播放按钮
    currentStatus(val) {
      console.log('val', val);
      this.tableData.forEach(item => {
        if (this.id === item.id) {
          console.log('this.id', this.id);
          item.paused = val;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import url('./style.less');
</style>
