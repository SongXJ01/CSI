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
			<view class="action">
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
				<navigator hover-class="none" :url="'/pages/Manage/' + item.name" class="nav-li" navigateTo
					:class="'bg-'+item.color" :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]"
					v-for="(item,index) in elements" :key="index">
					<view class="nav-title">{{item.title}}</view>
					<view class="nav-name">{{item.name}}</view>
					<text :class="'cuIcon-' + item.cuIcon"></text>
				</navigator>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>



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
			console.log("(测试VueX连接) 用户名：", this.user.loginname) // 使用 store 中的 user
			this.avatar = this.user.photo
		},
		data() {
			return {
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
			}
		}
	}
</script>

<style>
	.page {
		height: 100vh;
	}
</style>
