import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueVideoPlayer from 'vue-video-player'

import 'element-ui/lib/theme-chalk/index.css'
// require videojs style
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'


if (process.env.NODE_ENV === 'development') {
    window._static = "../../static/";
} else {
    window._static = global.__static + "//";
}

import { sendData, getData } from './utils/ipcUtils'
Vue.prototype.sendData = sendData
Vue.prototype.getData = getData

Vue.prototype.$getPath = (path) => {
	return 'file:'+ path
}

window.flag = true;
window.connectMessage = "正在连接服务器";
window.connectImg = window._static + "icon_lianjie.png";
window.speedMessage = '            ';
import 'swiper/dist/css/swiper.css'

Vue.use(VueAwesomeSwiper)


Vue.use(ElementUI);
Vue.use(VueVideoPlayer);

export const eventBus = new Vue()

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    template: '<App/>'
}).$mount('#app')
