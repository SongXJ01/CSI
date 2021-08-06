const state = () => ({
	email: "", // 用户邮箱
	loginname: "SongXJ", // 用户登录时的用户名
	password: "string", // 用户密码
	status: 0, // 用户身份权限  0-普通用户  1-管理员
	username: "string", // 姓名
	photo: '', // 头像
})

// getters
const getters = {}

// actions
const actions = {
	reset({ commit,state }) {
		console.log("用户信息已清除")
		state.email = "" // 用户邮箱
		state.loginname = "SongXJ" // 用户登录时的用户名
		state.password = "string" // 用户密码
		state.status = 0 // 用户身份权限  0-普通用户  1-管理员
		state.username = "string" // 姓名
		state.photo = '' // 头像
	}
}

// mutations
const mutations = {

}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
