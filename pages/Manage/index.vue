<template>
	<view>

		<cu-custom bgColor="bg-gradual-blue">
			<view slot="content">CSI 管理端</view>
		</cu-custom>


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

		}
	};
</script>

<style>


	.page {
		height: 100vh;
	}
</style>
