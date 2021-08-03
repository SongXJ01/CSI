import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'

Vue.use(Vuex)


export default new Vuex.Store({
	// 使用到的模块
	modules: {
		user
	},

	// 全局变量
	state: {
		logged: true, // 登录状态
		isHuman: false, // 真人验证
		apiPath: "http://81.68.194.16:8080", // API 接口路径
		// cloudPath: "https://yunxiang-1301994757.cos.ap-chongqing.myqcloud.com/image/",
		cloudPath: "https://cdn.jsdelivr.net/gh/SongXJ01/image-hosting/image/", // PicX 图床，GitHub 映射
	},

})
