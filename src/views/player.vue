<template>
  <div class="container">
    <div class="back" @click="$router.go(-1)"><i class="el-icon-refresh-left" /> 返回</div>
    <audio :src="songDetail.url" controls></audio>
  </div>
</template>

<script>
import { song } from '@/api/index';

const audio = document.createElement('audio');

// audio.

export default {
  name: 'Home',
  data() {
    return {
      songDetail: {},
    };
  },
  mounted() {
    this.getSong();
  },
  activated() {
    this.getSong();
  },
  deactivated() {
    this.songDetail = {}
  },
  methods: {
    getSong() {
      song({
        id: this.$route.query.id
      })
        .then(res => {
          console.log(res);
          this.songDetail = res.data && res.data[0]
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
@import url('./style.less');
</style>
