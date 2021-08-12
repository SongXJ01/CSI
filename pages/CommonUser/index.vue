<template>
	<view class="bg-white">

		<!-- 顶部导航栏 -->
		<view class="cu-bar search fixed text-white">
			<view class="cu-avatar radius" v-if="avatar==''" @tap="ChooseImage">
				<text class="cuIcon-people"></text>
			</view>
			<view v-else class="cu-avatar radius margin-left"
				:style="[{ backgroundImage:'url(' + 'data:image/jpeg;base64,'+ avatar+ ')' }]" @tap="ChooseImage">
			</view>
			<view class="content">CSI 用户端</view>
			<view class="action" @tap="showModal" data-target="DrawerModalR">
				<text class="cuIcon-more"></text>
			</view>
		</view>

		<!-- 顶部图片 -->
		<view class="UCenter-bg">
			<image src="/static/Logo.png" class="png" mode="widthFix"></image>
			<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
		</view>


		<scroll-view scroll-y class="margin-top-xl padding-top-xl">
			<view class="nav-list">
				<navigator hover-class="none" :url="'/pages/CommonUser/' + item.name" class="nav-li" navigateTo
					:class="'bg-'+item.color" :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]"
					v-for="(item,index) in elements" :key="index">
					<view class="nav-title">{{item.title}}</view>
					<view class="nav-name">{{item.name}}</view>
					<text :class="'cuIcon-' + item.cuIcon"></text>
				</navigator>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>



		<!-- 公告轮播 -->
		<swiper indicator-dots="true" indicator-color="rgb(255, 203, 129)" autoplay="true"
			class="card-swiper square-dot">
			<swiper-item v-for="(item,index) in noticeList" v-bind:key="item.id" v-if="index<10">
				<view class="notice margin padding-lg" @click="showDetail(item)">
					<view class="cf margin-bottom">
						<text class="text-bold text-xl fl">公告：{{item.title}}</text>
						<text class="cuIcon-file text-blue text-xl padding-left-sm" v-if="item.isaccessory==1"></text>
						<text class="text-right margin-left fr">By. {{item.loginname}}</text>
					</view>
					<view class="text-grey box-notice">{{item.content}}</view>
					<view class="text-grey text-right margin-top">{{item.create_date.split('T')[0]}}</view>
				</view>
			</swiper-item>
		</swiper>


		<!-- 右侧边栏 -->
		<view class="cu-modal drawer-modal justify-end" :class="modalName=='DrawerModalR'?'show':''" @tap="hideModal">
			<view class="cu-dialog basis-lg" @tap.stop="" :style="[{top:CustomBar+'px',height:'300rpx',}]">
				<view class="cu-list menu text-left">
					<navigator class="cu-item arrow" url="../index/forgetPsd">修改密码</navigator>
					<view class="cu-item arrow" @tap="ChooseImage">修改头像</view>
					<view class="cu-item arrow" @tap="SwitchAccount">切换账号</view>
				</view>
			</view>
		</view>



		<!-- 模态框 -->
		<view class="cu-modal show" v-if="modalName=='modelDetail'" @tap="hideDetail()">
			<view class="cu-dialog bg-white">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{nowNotice.title}} </view>
					<view class="action" @tap="hideDetail">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="content">
					<text class="margin-right">{{nowNotice.loginname}} </text>
					<text class="margin-left">{{nowNotice.create_date.split('T')[0]}} </text>
				</view>
				<!-- 展示信息 -->
				<scroll-view class="padding margin text-left noticeBorder notice-content">
					<view class="margin-sm"> {{nowNotice.content}}</view>
					<!-- 公告附件 -->
					<view class="text-center">
						<image class="accessory" :src="'data:image/jpeg;base64,'+ nowNotice.accessory" mode="aspectFill"
							v-if="nowNotice.isaccessory==1"></image>
					</view>
				</scroll-view>
			</view>
		</view>


		<!-- 空隙行 -->
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
		onLoad() {
			this.getNoticeList().then(res => {
				this.noticeList = res
			})
			this.avatar = this.user.photo
		},
		data() {
			return {
				CustomBar: this.CustomBar,
				modalName: '', // 右侧模态框
				noticeList: '', // 公告列表
				elements: [{
						title: '员工查询',
						name: 'StaffQuery',
						color: 'cyan',
						cuIcon: 'newsfill'
					},
					{
						title: '部门查询',
						name: 'DepartQuery',
						color: 'purple',
						cuIcon: 'font'
					}
				],
				avatar: '',
			}
		},

		methods: {
			// 加载公告列表
			getNoticeList() {
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '加载中'
					})
					uni.request({
						// url: "https://www.fastmock.site/mock/e34be376320e67bcbff402db4095587c/api/getNotice",
						url: this.$store.state.apiPath + "/notice/queryAll",
						method: "POST",
						data:{
							pageNum:1,
							pageSize:10
						},
						success: (res) => {
							uni.hideLoading()
							console.log(res)
							var noticeList = res.data.notices
							resolve(noticeList)
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			},

			// 上传头像
			ChooseImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						const tempFilePaths = res.tempFilePaths;
						uni.showLoading({
							title: '上传中'
						})
						uni.uploadFile({
							url: this.$store.state.apiPath + "/user/photoUpload",
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								'loginname': this.user.loginname,
								'email': this.user.email
							},
							success: (res) => {
								uni.hideLoading()
								var res = JSON.parse(res.data)
								console.log(res)
								this.avatar = res.data.photo
							}
						})
					}
				})
			},
			
			// 展示公告详情
			showDetail(item) {
				console.log("展示详情视图: ", item)
				uni.showLoading({
					title: '加载中'
				})
				uni.request({
					url: this.$store.state.apiPath + "/notice/queryById",
					method: "POST",
					data: {
						notice_id: item.notice_id
					},
					success: (res) => {
						console.log(res)
						this.modalName = "modelDetail"
						this.nowNotice = res.data.notice
						this.$store.dispatch('notice/Cache', res.data.notice)
						uni.hideLoading()
					},
				})
			},
			
			// 隐藏模态框
			hideDetail() {
				console.log("隐藏详情视图")
				this.nowNotice = ''
				this.modalName = ''
			},
			
			// 切换账号
			SwitchAccount() {
				uni.navigateTo({
					url: "../index/login"
				})
				this.$store.dispatch('user/reset')
			},
			// 模态框
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
		}
	}
</script>

<style>
	.page {
		height: 100vh;
	}

	.notice {
		height: 350rpx;
		background-color: #fffcc6;
		border-radius: 30rpx;
		border-style: dashed;
		border-color: #ffd498;
		border-width: 2px;
	}

	.box-notice {
		width: 450rpx;
		height: 60px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
	}
	
	.accessory {
		height: 200rpx;
		width: 200rpx;
		margin-left: auto;
		margin-right: auto;
	}
	
	/* 橘色圆角边框 */
	.noticeBorder {
		border-radius: 30rpx;
		border-style: solid;
		border-color: #f37b1d;
		border-width: 1.5px;
	}
	
	/* 公告内容 */
	.notice-content {
		width: 90%;
		height: 400rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
	}
</style>
