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

			<view class="cu-bar margin-top">
				<view class="action">
					附件上传：（{{filePathList.length}}/1）
				</view>
			</view>
			<!-- 进度条 -->
			<view class="padding-lr margin-bottom" v-if="upload_Progress!=0">
				<view v-if="upload_Progress==100">
					<view class="cu-progress round striped">
						<view class="bg-green" style="width:100%;"></view>
					</view>
					<text class="cuIcon-roundcheckfill text-green margin-left-sm"></text>
				</view>
				<view class="margin-top" v-else>
					<view class="cu-progress round striped active">
						<view class="bg-green" :style="'width:'+upload_Progress+'%;'"></view>
					</view>
					<text class="margin-left">{{upload_Progress}}%</text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in filePathList" :key="index" @tap="ViewImage"
						:data-url="filePathList[index]">
						<image :src="filePathList[index]" mode="aspectFill" v-if="fileList[index]"></image>
						<view class="cu-tag bg-red" @tap.stop="DelFile" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="filePathList.length<4">
						<text class='cuIcon-file'></text>
					</view>
				</view>
			</view>

			<view class="text-center">
				<button class="padding cu-btn round line-green shadow margin" @click="subNoticeAll()">提 交</button>
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
				tempFilePaths: [], // 临时文件路径
				filePathList: [], // 文件列表
				title: '',
				upload_Progress: 0, // 附件上传进度
			}
		},
		methods: {
			// 提交公告内容
			noticeSubmit() {
				return new Promise((resolve, reject) => {
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
							uni.hideLoading()
							console.log(res)
							resolve(res.data.notice_id)
						},
					})
				})
			},

			// 上传附件，前置条件提交所有公告信息
			subNoticeAll() {
				this.noticeSubmit().then(res => {
					var uploadTask = uni.uploadFile({
						url: this.$store.state.apiPath + "/notice/accessoryUpload",
						filePath: this.filePathList[0],
						name: 'file',
						formData: {
							'notice_id': res,
						},
						success: (res) => {
							var res = JSON.parse(res.data)
							console.log(res)
							this.resetNotice()
							this.$refs.uToast.show({
								title: '添加成功',
								type: 'success',
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 1000)
						}
					})

					uploadTask.onProgressUpdate((res) => {
						this.upload_Progress = res.progress
						console.log('上传进度' + res.progress)
						console.log('已经上传的数据长度' + res.totalBytesSent)
						console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend)
					});

				})
			},

			// 选择图片
			ChooseImage() {
				uni.chooseFile({
					count: 1, //默认9
					// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					// sourceType: ['album'], //从相册选择
					success: (res) => {
						console.log(res)
						if (this.filePathList.length != 0) {
							this.filePathList = this.filePathList.concat(res.tempFilePaths)
							this.fileList = this.fileList.concat(res.tempFiles)
						} else {
							this.filePathList = res.tempFilePaths
							this.fileList = res.tempFiles
						}
					}
				});
			},

			// 预览图片
			ViewImage(e) {
				uni.previewImage({
					urls: this.filePathList,
					current: e.currentTarget.dataset.url
				});
			},

			// 删除附件
			DelFile(e) {
				uni.showModal({
					title: '删除附件',
					content: '确定要删除此附件？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.filePathList.splice(e.currentTarget.dataset.index, 1)
						}
					}
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
