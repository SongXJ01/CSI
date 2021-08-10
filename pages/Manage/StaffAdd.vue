<template>
	<view class="bg-white">

		<!-- 顶部导航条 -->
		<view class="fixed">
			<cu-custom :isBack="true" bgColor="text-white">
				<block slot="backText">返回</block>
				<block slot="content">员工管理</block>
			</cu-custom>
		</view>
		<!-- 顶部图片 -->
		<view class="UCenter-bg">
			<image src="/static/Logo.png" class="png" mode="widthFix"></image>
			<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
		</view>


		<!-- 修改信息 -->
		<view class="padding-xl text-left">
			<view class="cu-form-group">
				<view class="title"><text class="cuIcon-peoplefill text-green margin-right-sm"></text>姓名：</view>
				<input v-model="nowStaff.emp_name" placeholder="(请填写姓名)" type="text"></input>

			</view>
			<view class="cu-form-group">
				<!-- 性别选择 -->
				<view class="title"><text class="cuIcon-favorfill text-green margin-right-sm"></text>性别：</view>
				<u-radio-group v-model="nowStaff.sex" @change="radioGroupChange">
					<u-radio v-for="(item, index) in genderlist" :key="index" :name="item.name"
						:disabled="item.disabled">
						<text :class="item.name==0?'cuIcon-male text-blue':'cuIcon-female text-pink'"></text>
					</u-radio>
				</u-radio-group>
				<picker @change="deptPickerChange" :value="deptIndex" :range="deptPicker">
					<view class="picker text-left">
						{{nowStaff.dept_name==''?'(请选择部门)':nowStaff.dept_name}}
					</view>
				</picker>
			</view>

			<view class="cu-form-group">
				<view class="title"><text class="cuIcon-dianhua text-green margin-right-sm"></text>电话：</view>
				<input v-model="nowStaff.phone" placeholder="(请填写电话)" type="text"></input>
			</view>
			<view class="cu-form-group">
				<view class="title"><text class="cuIcon-newsfill text-green margin-right-sm"></text>邮箱：</view>
				<input v-model="nowStaff.email" placeholder="(请填写邮箱)" type="text"></input>
			</view>
			<view class="cu-form-group">
				<view class="title"><text class="cuIcon-homefill text-green margin-right-sm"></text>地址：</view>
				<input v-model="nowStaff.address" placeholder="(请填写地址)" type="text"></input>
			</view>
			<view class="cu-form-group">
				<view class="title"><text class="cuIcon-medalfill text-green margin-right-sm"></text>学历：</view>
				<input v-model="nowStaff.speciality" placeholder="(专业)" type="text"></input>
				<picker @change="eduPickerChange" :value="eduIndex" :range="eduPicker">
					<view class="picker">
						{{nowStaff.education==''?'(请选择学历)':nowStaff.education}}
					</view>
				</picker>
			</view>
		</view>
		<view class="text-center">
			<button class="padding cu-btn round line-orange shadow margin" @click="addStaffSubmit()">确认添加</button>
		</view>

		<!-- 消息提示框 -->
		<u-toast ref="uToast" />
		<!-- 空白行 -->
		<view class='cu-tabbar-height'></view>
		<view class='cu-tabbar-height'></view>
		<view class='cu-tabbar-height'></view>
	</view>
</template>

<script>
	// 导入 VueX
	import {
		mapState,
		mapActions
	} from 'vuex'
	export default {
		// VueX 连接 staff
		computed: mapState({
			nowStaff: state => state.staff
		}),
		data() {
			return {
				genderlist: [{
						name: 0,
						disabled: false
					},
					{
						name: 1,
						disabled: false
					}
				], // 性别列表
				eduPicker: ['高中及以下', '本科', '硕士', '博士及以上'],
				eduIndex: -1,
				deptPicker: ['人事部', '公关部', '办公室', '宣传部'],
				deptIndex: -1,
			}
		},
		methods: {
			// 学历选择
			eduPickerChange(e) {
				this.nowStaff.education = this.eduPicker[e.detail.value]
			},
			// 部门选择
			deptPickerChange(e) {
				this.nowStaff.dept_name = this.deptPicker[e.detail.value]
			},

			// 提交员工添加信息
			addStaffSubmit() {
				if (this.verification()) {
					uni.showLoading({
						title: '添加中'
					})
					uni.request({
						url: this.$store.state.apiPath + "/employee/insert",
						method: "POST",
						data: {
							dept_id: 1,
							dept_name: this.nowStaff.dept_name,
							emp_name: this.nowStaff.emp_name,
							sex: this.nowStaff.sex,
							phone: this.nowStaff.phone,
							address: this.nowStaff.address,
							email: this.nowStaff.email,
							education: this.nowStaff.education,
							speciality: this.nowStaff.speciality
						},
						success: (res) => {
							console.log(res)
							uni.hideLoading()
							this.resetStaff()
							this.$refs.uToast.show({
								title: '添加成功',
								type: 'success',
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 1000)
						},
					})
				}
			},

			// 重置员工信息
			resetStaff() {
				this.nowStaff.dept_id = ''
				this.nowStaff.dept_name = ''
				this.nowStaff.emp_name = ''
				this.nowStaff.sex = ''
				this.nowStaff.phone = ''
				this.nowStaff.address = ''
				this.nowStaff.email = ''
				this.nowStaff.education = ''
				this.nowStaff.speciality = ''
			},

			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				console.log("修改性别：", this.nowStaff.sex);
			},

			// 验证输入框的合法性
			verification() {
				if (this.nowStaff.address < 1 || this.nowStaff.address > 100) {
					this.$refs.uToast.show({
						title: '请正确填写地址',
						type: 'error',
					})
					return false
				}
				if (this.nowStaff.emp_name < 1 || this.nowStaff.emp_name > 50) {
					this.$refs.uToast.show({
						title: '请正确填写姓名',
						type: 'error',
					})
					return false
				}
				if (this.nowStaff.education < 1 || this.nowStaff.education > 50) {
					this.$refs.uToast.show({
						title: '请正确填写学历',
						type: 'error',
					})
					return false
				}
				var regEmail =/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
				if (!regEmail.test(this.nowStaff.email)) {
					console.log(this.nowStaff.email)
					this.$refs.uToast.show({
						title: '请正确填写邮箱',
						type: 'error',
					})
					return false
				}
				var regPhone = /^1[3456789]d{9}$/
				if (!regPhone.test(this.nowStaff.phone)) {
					this.$refs.uToast.show({
						title: '请填写11位电话号码',
						type: 'error',
					})
					return false
				}
				return true
			}
		}
	}
</script>

<style>

</style>
