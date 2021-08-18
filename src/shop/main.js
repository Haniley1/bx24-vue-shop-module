import { createApp } from 'vue'

import { ElRow,ElCol,ElCarousel,ElCarouselItem } from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';

import App from './App.vue'

const app = createApp(App)
app.use(ElRow)
app.use(ElCol)
app.use(ElCarousel)
app.use(ElCarouselItem)

app.mount('#shop')