const state = () => ({
	email: "", // 用户邮箱
	loginname: "SongXJ", // 用户登录时的用户名
	password: "string", // 用户密码
	status: 0, // 用户身份权限  0-普通用户  1-管理员
	username: "string", // 姓名
})

// getters
const getters = {}

// actions
const actions = {

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
