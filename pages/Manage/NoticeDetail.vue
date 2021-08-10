<template>
	<view class="bg-white">

		<!-- 顶部导航条 -->
		<view class="fixed">
			<cu-custom :isBack="true" bgColor="text-white">
				<block slot="backText">返回</block>
				<block slot="content">公告管理</block>
			</cu-custom>
		</view>
		<!-- 顶部图片 -->
		<view class="UCenter-bg">
			<image src="/static/Logo.png" class="png" mode="widthFix"></image>
			<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
		</view>

		<!-- 修改公告框 -->
		<view class="margin-xl padding myBorder">
			<view class="text-bold text-center text-xl margin">修改公告</view>
			<view class="cu-form-group">
				<view class="title">题目：</view>
				<u-input class="" v-model="notice.title" placeholder="请输入公告题目" type="text" :border="true" />
			</view>

			<view class="margin text-lg">公告内容：</view>
			<view class="flex">
				<textarea class="notice-input margin padding justify-center text-gray" maxlength="-1"
					v-model="notice.content" @input="textareaInput" placeholder="请输入公告内容"></textarea>
			</view>
			<view class="text-center">
				<button class="padding cu-btn round line-green shadow margin" @click="noticeSubmit()">提 交</button>
			</view>
		</view>


		<!-- 消息提示框 -->
		<u-toast ref="uToast" />
		<!-- 空隙行 -->
		<view class='cu-tabbar-height'></view>
		<view class='cu-tabbar-height'></view>
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
			notice: state => state.notice,
			user: state => state.user
		}),
		data() {
			return {
				
			}
		},
		onLoad() {
			console.log("公告id：", this.notice.notice_id)
			console.log("用户名：", this.user.loginname)
		},
		methods: {
			// 提交公告内容
			noticeSubmit() {
				uni.showLoading({
					title: '修改中'
				})
				uni.request({
					url: this.$store.state.apiPath + "/notice/update",
					method: "POST",
					data: {
						notice_id: this.notice.notice_id,
						title: this.notice.title,
						content: this.textareaAValue,
						loginname: this.user.loginname
					},
					success: (res) => {
						uni.hideLoading()
						console.log(res)
						this.$refs.uToast.show({
							title: '修改公告成功',
							type: 'success',
						})
						setTimeout(() => {
							uni.navigateTo({
								url:"NoticeManage"
							})
						}, 1000)
					},
				})
			},

			// 动态更新公告内容
			textareaInput(e) {
				console.log(e.detail.value)
				this.textareaAValue = e.detail.value
			},
		}
	}
</script>

<style>
	/* 蓝色圆角边框 */
	.notice-input {
		width: 90%;
		border-radius: 30rpx;
		border-style: solid;
		border-color: #e1e3e3;
		border-width: 1px;
	}
</style>
