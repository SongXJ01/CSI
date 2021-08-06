const state = () => ({
	emp_id: "", // 员工ID
	dept_id: "", // 部门ID
	dept_name: "", // 部门名
	emp_name: "", // 姓名
	sex: 0, // 性别 0男 1女
	phone: '', // 电话
	address: '', // 地址
	email: '', //邮箱
	education: '', // 学历
	speciality: '', // 专业

})

// getters
const getters = {}

// actions
const actions = {
	Cache({ commit,state }, item) {
		console.log("员工信息已缓存")
		state.phone = item.phone
		state.emp_id = item.emp_id
		state.dept_id = item.dept_id
		state.emp_name = item.emp_name
		state.dept_name = item.dept_name
		state.sex = item.sex
		state.address = item.address
		state.email = item.email
		state.education = item.education
		state.speciality = item.speciality
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
