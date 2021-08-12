<template>
	<view class="bg-white">
		<!-- 滑动验证模态框 -->
		<view class="cu-modal" :class="modalName=='ModalVerify'?'show':''">
			<view class="cu-dialog bg-white padding">
				<move-verify @result='verifyResult' ref="verifyElement"></move-verify>
			</view>
		</view>

		<!-- 顶部导航条 -->
		<view class="fixed">
			<cu-custom :isBack="true" bgColor="text-white">
				<block slot="backText">返回</block>
			</cu-custom>
		</view>

		<!-- 顶部图片 -->
		<view class="UCenter-bg">
			<image src="/static/Logo.png" class="png" mode="widthFix"></image>
			<view class="margin-top-sm">
				<text>{{version}}</text>
			</view>
			<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
		</view>

		<!-- 注册框 -->
		<view class="padding margin-top-xl ">
			<view class="padding myBorder">
				<view class="text-bold text-center text-xl margin-top">注 册</view>
				<view class="content margin">
					<u-input class="margin" v-model="loginname" placeholder="请输入用户名" type="text" :border="border" />
					<u-input class="margin" v-model="username" placeholder="请输入姓名" type="text" :border="border" />
					<u-input class="margin" v-model="email" placeholder="请输入邮箱" type="email" :border="border" />
					<view class="cu-form-group">
						<u-input v-model="vCode" placeholder="请输入验证码" type="number" :border="border" />
						<button class='cu-btn shadow margin-left-sm bg-green' v-if="!vCodeStatus"
							@click="sendYzm">{{vCodeShow}}</button>
						<button class='cu-btn shadow margin-left-sm bg-grey' v-else @click="sendYzm"><text
								class="cuIcon-loading2 cuIconfont-spin margin-right-sm"></text>
							{{vCodeShow}}秒重新获取</button>

					</view>

					<u-input class="margin" v-model="psd1" placeholder="请输入密码" type='password' :border="border" />
					<u-input class="margin" v-model="psd2" placeholder="请再次输入密码" type='password' :border="border" />
					<view class="u-config-item">
						<view class="text-bold text margin">选择身份：</view>
						<u-subsection :current="status" :list="['普通用户','管理员']" @change="identityChange">
						</u-subsection>
					</view>
				</view>
				<view class="padding text-center grid col-3 align-center">
					<view></view>
					<button class="padding cu-btn round bg-gradual-blue shadow lg margin-tb" @click="isHuman()">注
						册</button>
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
			this.version = this.$store.state.version
			console.log("(测试VueX连接) 版本号：", this.$store.state.version)
			console.log("(测试VueX连接) 用户名：", this.user.loginname) // 使用 store 中的 user
		},
		onHide() { // 页面隐藏消除定时器
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
		},

		data() {
			return {
				loginname: '',
				email: '', // 邮箱
				vCode: '', // 验证码
				vCodeStatus: false, // 验证码获取状态
				vCodeShow: '获取验证码',
				psd1: '', // 第一次输入密码
				psd2: '', // 再次输入密码
				status: 0, // 权限 0-普通用户，1-管理员
				username: '', // 姓名
				border: true,
				modalName: '',
				timer: null, // 验证码定时器
				verifyRes: this.$store.state.isHuman, // 真人验证
			}
		},

		methods: {
			// 获取验证码
			sendYzm() {
				if (!this.vCodeStatus) { // 只有在未获取验证码的状态下才可发送请求
					uni.showLoading({
						title: '正在获取验证码'
					})
					uni.request({
						url: this.$store.state.apiPath + "/user/sendYzm",
						method: 'POST',
						data: {
							"email": this.email,
						},
						success: (res) => {
							console.log("请求 sendYzm 接口成功", res)
							if (res.data.desc == "发送成功") {
								uni.hideLoading()
								this.$refs.uToast.show({
									title: res.data.desc,
									type: 'success',
								})
								this.vCodeStatus = true
								// 倒计时
								this.vCodeShow = 60
								this.timer = setInterval(() => {
									if (this.vCodeShow > 0) {
										this.vCodeShow = this.vCodeShow - 1
									} else {
										clearTimeout(this.timer);
										this.timer = null;
										this.vCodeStatus = false
										this.vCodeShow = '重新获取验证码'
									}
								}, 1000)
							} else {
								this.$refs.uToast.show({
									title: res.data.desc,
									type: 'error',
								})
							}
						},
						fail: (err) => {
							console.log("请求 sendYzm 接口失败")
						}
					})
				}
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

			// 发送注册请求
			register() {
				if (this.verification()) {
					uni.request({
						url: this.$store.state.apiPath + "/user/register",
						method: 'POST',
						data: {
							"email": this.email,
							"loginname": this.loginname,
							"password": this.psd1,
							"status": this.status,
							"username": this.username,
							"yzm": this.vCode,
						},
						success: (res) => {
							console.log("请求 register 接口成功", res)
							if (res.data.desc == "注册成功") {
								// 更新全局变量
								this.user.loginname = this.loginname
								this.user.email = this.email
								this.user.status = this.status
								this.user.username = this.username
								this.$refs.uToast.show({
									title: '注册成功',
									type: 'success',
								})
								uni.navigateTo({
									url: '../index/login'
								})
							} else {
								this.$refs.uToast.show({
									title: res.data.desc,
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
				if (this.loginname.length > 20 || this.loginname.length == 0) {
					this.$refs.uToast.show({
						title: '用户名不合法',
						type: 'error',
					})
					return false
				}
				var regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
				if (!regEmail.test(this.email)) {
					this.$refs.uToast.show({
						title: '邮箱格式不合法',
						type: 'error',
					})
					return false
				}
				var regPsd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
				if (!regPsd.test(this.psd1)) {
					this.$refs.uToast.show({
						title: '请输入(6-16位)数字和字母组合',
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
