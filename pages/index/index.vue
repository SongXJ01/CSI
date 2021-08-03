<template>
	<view class="wrap">

		<view class="content">
			<view class="title">CSI 员工之家</view>
		</view>

		<scroll-view scroll-y class="page">
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
	export default {
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
						name: 'icon',
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

<style lang="scss" scoped>
	.wrap {
		font-size: 28rpx;

		.content {
			width: 600rpx;
			margin: 80rpx auto 0;

			.title {
				text-align: left;
				font-size: 60rpx;
				font-weight: 500;
				margin-bottom: 100rpx;
			}

		}

	}

	.page {
		height: 100vh;
	}
</style>
