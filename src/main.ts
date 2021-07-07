import { createApp } from 'vue'
import App from './App'
import router from './router'
import store from './store'

import { components, plugins } from './element'
import '@/assets/icons/iconfont.css'
import '@/common/reset.less'
import '@/common/common.less'

const app = createApp(App)

components.forEach(component => {
  app.component(component.name, component)
})

plugins.forEach(plugin => {
  app.use(plugin)
})

app
  .use(router)
  .use(store)
  .mount('#app')
