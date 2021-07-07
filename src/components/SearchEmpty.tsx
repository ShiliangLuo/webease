import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchEmpty',
  setup() {
    return () => {
      return (
        <div class="table-search-empty">
          <div>抱歉，没有任何搜索结果</div>
        </div>
      )
    }
  },
})
