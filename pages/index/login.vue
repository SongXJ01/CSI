<template >
	<view class="bg-white">
		<!-- 滑动验证模态框 -->
		<view class="cu-modal" :class="modalName=='ModalVerify'?'show':''">
			<view class="cu-dialog bg-white padding">
				<move-verify @result='verifyResult' ref="verifyElement"></move-verify>
			</view>
		</view>

		<!-- 顶部图片 -->
		<view class="UCenter-bg">
			<image src="/static/Logo.png" class="png" mode="widthFix"></image>
			<view class="margin-top-sm">
				<text>V 1.0.0</text>
			</view>
			<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
		</view>

		<!-- 登录框 -->
		<view class="padding margin-top-xl">
			<view class="padding myBorder">
				<view class="text-bold text-center text-xl margin-top">登 录</view>
				<view class="content margin">
					<u-input class="margin" v-model="loginname" placeholder="请输入用户名" type="text" :border="border" />
					<u-input class="margin" v-model="psd" placeholder="请输入密码" type='password' :border="border" />
					<view class="u-config-item">
						<view class="text-bold text margin">选择身份：</view>
						<u-subsection :current="status" :list="['普通用户','管理员']" @change="identityChange">
						</u-subsection>
					</view>
				</view>
				<view class="padding text-center grid col-3 align-center">
					<view class="text-left text-green" @click="toRegister"> （注册） </view>
					<button class="padding cu-btn round bg-gradual-blue shadow lg margin-tb" @click="isHuman()">登
						录</button>
					<view class="text-right text-blue hyperlink" @click="toForgetPsd">忘记密码</view>
				</view>
			</view>
		</view>


		<!-- 消息提示框 -->
		<u-toast ref="uToast" />
		<!-- 空白行 -->
		<view class='cu-tabbar-height'></view>
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
				psd: '',
				status: 0,
				border: true,
				modalName: '',
				verifyRes: this.$store.state.isHuman, // 真人验证
			}
		},

		methods: {
			// 滑动模块校验结果回调函数
			verifyResult(res) {
				console.log(res.flag);
				if (res.flag) {
					this.modalName = ''
					this.verifyRes = true
					this.$store.state.isHuman = true
					this.login()
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
					this.login()
				} else {
					this.modalName = 'ModalVerify'
				}
			},

			// 发送登录请求
			login() {
				if (this.verification()) {
					uni.request({
						url: this.$store.state.apiPath + "/user/login",
						method: 'POST',
						data: {
							"loginname": this.loginname,
							"password": this.psd,
						},
						success: (res) => {
							console.log("请求 login 接口成功", res)
							if (res.data.desc == "登陆成功") {
								if (res.data.data.status == this.status) {
									// 更新全局变量
									this.user.loginname = res.data.data.loginname
									this.user.email = res.data.data.email
									this.user.status = res.data.data.status
									this.user.loginname = res.data.data.loginname
									this.user.photo = res.data.data.photo
									this.$refs.uToast.show({
										title: '登录成功',
										type: 'success',
									})
									if (this.status == 1) {
										uni.navigateTo({
											url: '../Manage/index'
										})
									} else {
										uni.navigateTo({
											url: '../CommonUser/index'
										})
									}
								} else {
									this.$refs.uToast.show({
										title: '权限错误',
										type: 'error',
									})
								}
							} else {
								this.$refs.uToast.show({
									title: res.data.desc,
									type: 'error',
								})
							}
						},
						fail: (err) => {
							console.log("请求 login 接口失败")
						}
					})
				}
			},

			// 跳转注册页面
			toRegister() {
				uni.navigateTo({
					url: './register'
				})
			},


			// 跳转忘记密码页面
			toForgetPsd() {
				uni.navigateTo({
					url: './forgetPsd'
				})
			},

			// 验证输入框的合法性
			verification() {
				if (this.loginname.length > 20 || this.loginname.length == 0) {
					this.$refs.uToast.show({
						title: '用户名不合法',
						type: 'error',
					})
					return false
				}
				if (this.psd.length > 20 || this.psd.length == 0) {
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

<style lang="scss" scoped>
	.wrap {
		font-size: 28rpx;

		.content {
			width: 600rpx;
			margin: 80rpx auto 0;

		}
	}

	.hyperlink {
		text-decoration: underline;
		color: #0081FF;
	}
</style>
