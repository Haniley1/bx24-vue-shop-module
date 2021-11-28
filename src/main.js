import { createApp } from 'vue'
import { ElRow,ElCol,ElCarousel,ElCarouselItem } from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';
import App from './App.vue'

const plugins = [ElRow, ElCol, ElCarousel, ElCarouselItem]

const app = createApp(App)
plugins.forEach(plugin => app.use(plugin))

app.mount('#shop')