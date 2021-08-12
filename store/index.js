import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
import staff from './modules/staff.js'
import notice from './modules/notice.js'

Vue.use(Vuex)


export default new Vuex.Store({
	// 使用到的模块
	modules: {
		user,
		staff,
		notice
	},

	// 全局变量
	state: {
		version: "V 1.3.2", // 版本号
		logged: true, // 登录状态
		isHuman: false, // 真人验证
		apiPath: "http://81.68.194.16:8080", // API 接口路径
		colorList: ['orange', 'olive', 'blue', 'purple', 'cyan', 'mauve', 'yellow', 'red', 'green', 'pink',
			'brown'
		],
		// cloudPath: "https://cdn.jsdelivr.net/gh/SongXJ01/image-hosting/image/", // PicX 图床，GitHub 映射
	},

})
