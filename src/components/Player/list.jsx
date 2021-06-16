const { defineComponent, toRefs } = require('vue');

const List = defineComponent({
  props: ['data', 'collapsed', 'currentIndex', 'source'],
  emits: ['show', 'clear-store', 'clear-item', 'click'],
  setup(props, { emit }) {
    const { data, collapsed, currentIndex, source } = toRefs(props);

    return () => (
      <div class="player-list">
        <div class="collapse-btn pointer" onClick={() => emit('show')}>
          {collapsed.value ? (
            <i class="el-icon-s-unfold" />
          ) : (
            <i class="el-icon-s-fold" />
          )}
        </div>

        <div
          class="player-list-container"
          style={{ right: collapsed.value ? '-300px' : 0 }}
        >
          <div class="player-list-clear">
            <span onClick={() => emit('clear-store')}>清空列表</span>
          </div>
          <ul>
            {data.value.map((item, index) => {
              return (
                <li
                  class={
                    currentIndex.value === index && source.value
                      ? 'playing'
                      : ''
                  }
                >
                  <div
                    class="list-title"
                    onClick={() => emit('click', item.id, index)}
                  >
                    {item.name}
                  </div>
                  <div class="list-time">{item.time}</div>
                  <div class="list-icon">
                    <i class="iconfont icon-SOUNDPLUS" />
                  </div>
                  <div class="list-delete">
                    <i
                      class="el-icon-circle-close"
                      onClick={() => emit('clear-item', item.id)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  },
});

export default List;
