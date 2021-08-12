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

			<view class="cu-bar margin-top">
				<view class="action" v-if="notice.isaccessory==1">
					附件上传：（1/1）
				</view>
				<view class="action" v-else>
					附件上传：（{{fileList.length}}/1）
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
					<view v-if="notice.isaccessory==1 && isPreview" class="bg-img">
						<image :src="'data:image/jpeg;base64,'+ notice.accessory" mode="aspectFill" @tap="ChooseImage">
						</image>
					</view>
					<view class="bg-img" v-for="(item,index) in fileList" :key="index" :data-url="fileList[index]"
						v-else>
						<image :src="fileList[index]" mode="aspectFill" @tap="ChooseImage"></image>
						<view class="cu-tag bg-red" @tap.stop="DelFile" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="fileList.length<1">
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
		// VueX 连接 staff
		computed: mapState({
			notice: state => state.notice,
			user: state => state.user
		}),
		data() {
			return {
				isPreview: true, // 是否预览
				tempFilePaths: [], // 临时文件路径
				fileList: [], // 文件列表
				upload_Progress: 0, // 附件上传进度
			}
		},
		onLoad() {
			console.log("notice.notice_id", this.notice.notice_id)
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
						content: this.notice.content,
						loginname: this.user.loginname
					},
					success: (res) => {
						console.log(res)
						uni.hideLoading()	
					},
				})
			},

			// 上传附件，前置条件提交所有公告信息
			subNoticeAll() {
				this.noticeSubmit()
				if (this.isaccessory == 0 || !this.isPreview) {
					var uploadTask = uni.uploadFile({
						url: this.$store.state.apiPath + "/notice/accessoryUpload",
						filePath: this.fileList[0],
						name: 'file',
						formData: {
							'notice_id': this.notice.notice_id,
						},
						success: (res) => {
							var res = JSON.parse(res.data)
							console.log(res)
							this.$refs.uToast.show({
								title: '修改公告成功',
								type: 'success',
							})
							setTimeout(() => {
								uni.navigateTo({
									url: "NoticeManage"
								})
							}, 1000)
						}
					})

					uploadTask.onProgressUpdate((res) => {
						this.upload_Progress = res.progress
						console.log('上传进度' + res.progress)
						console.log('已经上传的数据长度' + res.totalBytesSent)
						console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend)
					})
				} else {
					setTimeout(() => {
						uni.navigateTo({
							url: "NoticeManage"
						})
					}, 1000)
				}


			},

			// 选择图片
			ChooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						console.log(res)
						this.isPreview = false
						this.fileList = res.tempFilePaths
						this.fileTypeList = res.tempFiles
					}
				});
			},

			// 预览图片
			ViewImage(e) {
				uni.previewImage({
					urls: this.fileList,
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
							this.fileList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},


			// 动态更新公告内容
			textareaInput(e) {
				console.log(e.detail.value)
				this.notice.content = e.detail.value
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
