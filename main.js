import Vue from 'vue'
import App from './App'
import store from 'store'
import user from 'store/modules/user.js'

// 引入 VueX
import Vuex from 'vuex'
Vue.use(Vuex)

import uView from "uview-ui"
Vue.use(uView);
import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)

Vue.config.productionTip = false

App.mpType = 'app'


const app = new Vue({
	store,
	...App
})
app.$mount()
