<template>
  <div class="hello">
    <input type="text" v-model="searchKey" />
    <input type="button" value="搜索" @click="searchMusic" />
    <input type="button" value="测试搜索" @click="test" />
  </div>
</template>

<script>
import { search, test } from '@/api/index';

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      searchKey: '',
    };
  },
  methods: {
    searchMusic() {
      search({
        keywords: this.searchKey,
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    test() {
      test({
        keywords: this.searchKey,
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
