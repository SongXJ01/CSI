<template>
	<view>

		<!-- 顶部导航栏 -->
		<view class="cu-bar bg-gradual-blue search">
			<view class="cu-avatar radius" v-if="avatar==''" @tap="ChooseImage">
				<text class="cuIcon-people"></text>
			</view>
			<view v-else class="cu-avatar radius margin-left" :style="[{ backgroundImage:'url(' + avatar + ')' }]"
				@tap="ChooseImage">
			</view>

			<view class="content">
				CSI 管理端
			</view>
			<view class="action">
				<text class="cuIcon-more"></text>
			</view>
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
		},
		data() {
			return {
				avatar: '',
				// avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big81005.jpg', // 头像
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
								'username': "123", 
								'email': "123@123" 
							},
							success: (res) => {
								console.log(res)
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
