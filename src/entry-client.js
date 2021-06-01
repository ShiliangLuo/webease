import createApp from './main';

const { app, router, store } = createApp();

// window.__INITIAL_STATE__ 保存的是服务端返回的 context.state，客户端在挂载之前，将其替换到 store.state 中
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始路由 resolve 后执行，
  // 以便我们不会二次预取(double-fetch)已有的数据。
  // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const preMatched = router.getMatchedComponents(from);

    // 非预渲染的组件，找出两个匹配列表的差异组件
    let diff = true;
    const activated = matched.filter((c, i) => {
      return diff && (diff = preMatched[i] !== c);
    });

    if (!activated.length) {
      return next();
    }

    Promise.all(
      activated.map(c => {
        if (c.asyncData) {
          return c.asyncData({ store, route: to });
        }
      })
    )
      .then(() => {
        next();
      })
      .catch(next);
  });

  app.$mount('#app');
});
