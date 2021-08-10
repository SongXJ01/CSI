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

		<view class="margin-xl padding myBorder">
			<view class="text-bold text-center text-xl margin">新增公告</view>
			<view class="cu-form-group">
				<view class="title">题目：</view>
				<u-input class="" v-model="title" placeholder="请输入公告题目" type="text" :border="true" />
			</view>

			<view class="margin text-lg">公告内容：</view>
			<view class="flex">
				<textarea class="notice-input margin padding justify-center text-gray" maxlength="-1"
					@input="textareaInput" placeholder="请输入公告内容"></textarea>
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
		// VueX 连接 user
		computed: mapState({
			user: state => state.user
		}),
		data() {
			return {
				title: '',
			}
		},
		methods: {
			// 提交公告内容
			noticeSubmit() {
				uni.showLoading({
					title: '添加中'
				})
				uni.request({
					url: this.$store.state.apiPath + "/notice/insert",
					method: "POST",
					data: {
						title: this.title,
						content: this.textareaAValue,
						loginname: this.user.loginname
					},
					success: (res) => {
						this.resetNotice()
						uni.hideLoading()
						console.log(res)
						this.$refs.uToast.show({
							title: '添加成功',
							type: 'success',
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					},
				})
			},
			
			// 重置公告信息
			resetNotice() {
				this.title = ''
				this.textareaAValue = ''
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
