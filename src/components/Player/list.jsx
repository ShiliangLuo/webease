const { defineComponent, toRefs } = require('vue');

const List = defineComponent({
  props: ['data', 'collapsed', 'currentIndex', 'source'],
  emits: ['show', 'clear-store', 'clear-item', 'click'],
  setup(props, { emit }) {
    const { data, collapsed, currentIndex, source } = toRefs(props);

    return () => (
      <div className="player-list">
        <div className="collapse-btn pointer" onClick={() => emit('show')}>
          {collapsed.value ? (
            <i className="el-icon-s-unfold" />
          ) : (
            <i className="el-icon-s-fold" />
          )}
        </div>

        <div
          className="player-list-container"
          style={{ right: collapsed.value ? '-300px' : 0 }}
        >
          <div className="player-list-clear">
            <span onClick={() => emit('clear-store')}>清空列表</span>
          </div>
          <ul>
            {data.value.map((item, index) => {
              return (
                <li
                  className={
                    currentIndex.value === index && source.value
                      ? 'playing'
                      : ''
                  }
                >
                  <div
                    className="list-title"
                    onClick={() => emit('click', item.id, index)}
                  >
                    {item.name}
                  </div>
                  <div className="list-time">{item.time}</div>
                  <div className="list-icon">
                    <i className="iconfont icon-SOUNDPLUS" />
                  </div>
                  <div className="list-delete">
                    <i
                      className="el-icon-circle-close"
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
