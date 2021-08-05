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
			<view class="content">CSI 管理端</view>
			<view class="action"  @tap="showModal" data-target="DrawerModalR">
				<text class="cuIcon-more"></text>
			</view>
		</view>

		<!-- 顶部图片 -->
		<view class="UCenter-bg">
			<image src="/static/Logo.png" class="png" mode="widthFix"></image>
			<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
		</view>

		<!-- 功能栏 -->
		<scroll-view scroll-y class="margin-top-xl padding-top-xl">
			<view class="nav-list">
				<navigator hover-class="none" :url="'/pages/Manage/' + item.name" class="nav-li" navigateTo
					:class="'bg-'+item.color" :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]"
					v-for="(item,index) in elements" :key="index">
					<view class="nav-title">{{item.title}}</view>
					<view class="nav-name">{{item.name}}</view>
					<text :class="'cuIcon-' + item.cuIcon"></text>
				</navigator>
			</view>
		</scroll-view>

		<!-- 公告轮播 -->
		<swiper indicator-dots="true" indicator-color="rgb(255, 203, 129)" autoplay="true"
			class="card-swiper square-dot">
			<swiper-item v-for="(item,index) in noticeList" v-if="index<10">
				<view class="notice margin padding-lg ">
					<view class="cf margin-bottom">
						<text class="text-bold text-xl fl">公告：{{item.title}}</text>
						<text class="text-right margin-left fr">By. {{item.loginname}}</text>
					</view>
					<view class="text-grey box-notice">{{item.content}}</view>
					<view class="text-grey text-right margin-top">{{item.create_date}}</view>
				</view>
			</swiper-item>
		</swiper>

		<!-- 右侧边栏 -->
		<view class="cu-modal drawer-modal justify-end" :class="modalName=='DrawerModalR'?'show':''" @tap="hideModal">
			<view class="cu-dialog basis-lg" @tap.stop="" :style="[{top:CustomBar+'px',height:'200rpx',}]">
				<view class="cu-list menu text-left">
					<view class="cu-item arrow">修改密码</view>
					<view class="cu-item arrow" @tap="ChooseImage">修改头像</view>
				</view>
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
						title: '员工管理',
						name: 'StaffManage',
						color: 'cyan',
						cuIcon: 'newsfill'
					},
					{
						title: '用户管理',
						name: 'UserManage',
						color: 'blue',
						cuIcon: 'myfill'
					},
					{
						title: '部门管理',
						name: 'DepartManage',
						color: 'purple',
						cuIcon: 'font'
					},
					{
						title: '公告管理 ',
						name: 'NoticeManage',
						color: 'mauve',
						cuIcon: 'colorlens'
					}
				],
				avatar: '',
			}
		},

		methods: {

			// 异步加载公告列表
			getNoticeList() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: "https://www.fastmock.site/mock/e34be376320e67bcbff402db4095587c/api/getNotice",
						// url: this.$store.state.apiPath + "/employee/query2",
						method: "POST",
						success: (res) => {
							console.log(res.data.data)
							var noticeList = res.data.data.notice
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
						uni.uploadFile({
							url: this.$store.state.apiPath + "/user/photoUpload",
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								'loginname': this.user.loginname,
								'email': this.user.email
							},
							success: (res) => {
								var res = JSON.parse(res.data)
								console.log(res)
								this.avatar = res.data.photo

							}
						})
					}
				})
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
		height: 62px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
	}
</style>
