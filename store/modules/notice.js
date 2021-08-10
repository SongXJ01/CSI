const state = () => ({
	notice_id: "", // 公告ID
	title: "", // 公告题目
	content: "", // 公告内容
	loginname: "", // 公告发起人
	create_date: "", // 公告创建时间
})

// getters
const getters = {}

// actions
const actions = {
	Cache({ commit,state }, nowNotice) {
		console.log("公告信息已缓存")
		state.notice_id = nowNotice.notice_id
		state.title = nowNotice.title
		state.content = nowNotice.content
		state.loginname = nowNotice.loginname
		state.create_date = nowNotice.create_date
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
