const state = () => ({
	emp_id: "", // 员工ID
	dept_id: "", // 部门ID
	dept_name: "", // 部门名
	emp_name: 0, // 姓名
	sex: "string", // 性别 0男 1女
	phone: '', // 电话
	address:'',// 地址
	email:'',//邮箱
	education:'',// 学历
	speciality:'',// 专业
	
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
