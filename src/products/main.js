import { createApp } from 'vue'

import { ElIcon } from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';

import App from './App.vue'

const app = createApp(App)
app.use(ElIcon)

app.mount('#products')