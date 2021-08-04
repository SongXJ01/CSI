<template>
	<view class="bg-white">

		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view slot="content">找回密码</view>
		</cu-custom>

		<view class="padding margin-top-xl ">
			<view class="padding myBorder">
				<view class="text-bold text-center text-xl margin-top">重置密码</view>
				<view class="content margin">
					<u-input class="margin" v-model="email" placeholder="请输入邮箱" type="email" :border="border" />
					<view class="cu-form-group">
						<u-input v-model="vCode" placeholder="请输入验证码" type="number" :border="border" />
						<button class='cu-btn bg-green shadow margin-left-sm' @click="sendYzm">获取验证码</button>
					</view>

					<u-input class="margin" v-model="psd1" placeholder="请输入密码" type='password' :border="border" />
					<u-input class="margin" v-model="psd2" placeholder="请再次输入密码" type='password' :border="border" />

				</view>
				<view class="padding text-center grid col-3 align-center">
					<view></view>
					<button class="padding cu-btn round bg-gradual-blue shadow lg margin-tb" @click="isHuman()">确定重置</button>
				</view>
			</view>
		</view>


		<!-- 消息提示框 -->
		<u-toast ref="uToast" />
		<!-- 空白行 -->
		<view class='cu-tabbar-height'></view>

	</view>
</template>

<script>
	import moveVerify from "@/components/helang-moveVerify/helang-moveVerify.vue"
	// 导入 VueX
	import {
		mapState,
		mapActions
	} from 'vuex'

	export default {
		// 滑动验证模块
		components: {
			"move-verify": moveVerify
		},
		// VueX 连接 user
		computed: mapState({
			user: state => state.user
		}),
		onLoad() {
			console.log("(测试VueX连接) 云存储路径：", this.$store.state.cloudPath)
			console.log("(测试VueX连接) 用户名：", this.user.loginname) // 使用 store 中的 user
		},

		data() {
			return {
				loginname: '',
				email: '', // 邮箱
				vCode: '', // 验证码
				psd1: '', // 第一次输入密码
				psd2: '', // 再次输入密码
				status: '', // 权限 0-普通用户，1-管理员
				username: '', // 姓名
				border: true,
				modalName: '',
				verifyRes: this.$store.state.isHuman, // 真人验证
			}
		},

		methods: {
			// 获取验证码
			sendYzm() {
				uni.request({
					url: this.$store.state.apiPath + "/user/sendYzm",
					method: 'POST',
					data: {
						"email": this.email,
					},
					success: (res) => {
						console.log("请求 sendYzm 接口成功", res)
					},
					fail: (err) => {
						console.log("请求 sendYzm 接口失败")
					}
				})
			},

			// 滑动模块校验结果回调函数
			verifyResult(res) {
				console.log(res.flag);
				if (res.flag) {
					this.modalName = ''
					this.verifyRes = true
					this.$store.state.isHuman = true
					this.register()
					this.$refs.verifyElement.reset() // 重置滑块
				}
			},

			// 状态切换，0-管理员；1-普通用户
			identityChange(index) {
				console.log(index)
				this.status = index == 0 ? 0 : 1;
			},

			// 验证是否是人类
			isHuman() {
				if (this.verifyRes) {
					this.register()
				} else {
					this.modalName = 'ModalVerify'
				}
			},

			// 发送登录请求
			register() {
				if (this.verification()) {
					uni.request({
						url: this.$store.state.apiPath + "/user/register",
						method: 'POST',
						data: {
							"email": this.email,
							"loginname": this.loginname,
							"password": this.psd,
							"status": this.status,
							"username": this.username,
						},
						success: (res) => {
							console.log("请求 register 接口成功", res)
							if (res.data.desc == "登陆成功") {
								if (res.data.data.status == this.status) {
									// 更新全局变量
									this.user.loginname = res.data.data.loginname
									this.user.email = res.data.data.email
									this.user.status = res.data.data.status
									this.user.username = res.data.data.username
									this.$refs.uToast.show({
										title: '登录成功',
										type: 'success',
									})
									uni.navigateTo({
										url: '../Manage/index'
									})
								} else {
									this.$refs.uToast.show({
										title: '权限错误',
										type: 'error',
									})
								}
							} else {
								this.$refs.uToast.show({
									title: '用户名或密码错误',
									type: 'error',
								})
							}
						},
						fail: (err) => {
							console.log("请求 register 接口失败")
						}
					})
				}
			},

			// 验证输入框的合法性
			verification() {
				if (this.username.length > 20 || this.username.length == 0) {
					this.$refs.uToast.show({
						title: '用户名不合法',
						type: 'error',
					})
					return false
				}
				if (this.psd1.length > 20 || this.psd1.length == 0) {
					this.$refs.uToast.show({
						title: '密码不合法',
						type: 'error',
					})
					return false
				}
				return true
			}
		}
	};
</script>

<style>

</style>
