<template>
	<view class="bg-white">

		<!-- 顶部导航条 -->
		<view class="fixed">
			<cu-custom :isBack="true" bgColor="text-white">
				<block slot="backText">返回</block>
			</cu-custom>
		</view>
		<!-- 顶部图片 -->
		<view class="UCenter-bg">
			<image src="/static/Logo.png" class="png" mode="widthFix"></image>
			<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
		</view>

		<!-- 空隙行 -->
		<view class='cu-tabbar-height'></view>

		<view class="padding margin-top-xl ">
			<view class="padding myBorder">
				<view class="text-bold text-center text-xl margin-top">重置密码</view>
				<view class="content margin">
					<u-input class="margin" v-model="email" placeholder="请输入邮箱" type="email" :border="border" />
					<view class="cu-form-group">
						<u-input v-model="vCode" placeholder="请输入验证码" type="number" :border="border" />
						<button class='cu-btn shadow margin-left-sm bg-green' v-if="!vCodeStatus"
							@click="sendYzm">{{vCodeShow}}</button>
						<button class='cu-btn shadow margin-left-sm bg-grey' v-else @click="sendYzm"><text
								class="cuIcon-loading2 cuIconfont-spin margin-right-sm"></text> {{vCodeShow}} s</button>
					</view>

					<u-input class="margin" v-model="psd1" placeholder="请输入密码" type='password' :border="border" />
					<u-input class="margin" v-model="psd2" placeholder="请再次输入密码" type='password' :border="border" />

				</view>
				<view class="padding text-center grid col-3 align-center">
					<view></view>
					<button class="padding cu-btn round bg-gradual-blue shadow lg margin-tb"
						@click="isHuman()">确定重置</button>
				</view>
			</view>
		</view>

		<!-- 滑动验证模态框 -->
		<view class="cu-modal" :class="modalName=='ModalVerify'?'show':''">
			<view class="cu-dialog bg-white padding">
				<move-verify @result='verifyResult' ref="verifyElement"></move-verify>
			</view>
		</view>

		<!-- 消息提示框 -->
		<u-toast ref="uToast" />
		<!-- 空白行 -->
		<view class='cu-tabbar-height'></view>
		<view class='cu-tabbar-height'></view>
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
		onHide() { // 页面隐藏消除定时器
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
		},

		data() {
			return {
				email: '', // 邮箱
				vCode: '', // 验证码
				vCodeStatus: false, // 验证码获取状态
				vCodeShow: '获取验证码',
				psd1: '', // 第一次输入密码
				psd2: '', // 再次输入密码
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
							uni.hideLoading()
							console.log("请求 sendYzm 接口成功", res)
							if (res.data.desc == "发送成功") {
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


			// 验证是否是人类
			isHuman() {
				if (this.verifyRes) {
					this.register()
				} else {
					this.modalName = 'ModalVerify'
				}
			},

			// 发送重置密码请求
			register() {
				if (this.verification()) {
					uni.showLoading({
						title: '正在重置密码'
					})
					uni.request({
						url: this.$store.state.apiPath + "/user/changePassword",
						method: 'POST',
						data: {
							"email": this.email,
							"password": this.psd1,
							"yzm": this.vCode,
						},
						success: (res) => {
							uni.hideLoading()
							console.log("请求 changePassword 接口成功", res)
							if (res.data.desc == "修改密码成功") {
								// 更新全局变量
								this.user.loginname = res.data.data.loginname
								this.user.email = res.data.data.email
								this.user.status = res.data.data.status
								this.user.username = res.data.data.username
								this.$refs.uToast.show({
									title: res.data.desc,
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
							console.log("请求 changePassword 接口失败")
						}
					})
				}
			},



			// 验证输入框的合法性
			verification() {
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
