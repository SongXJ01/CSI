<template>
	<view class="bg-white">
		
		<!-- 顶部导航条 -->
		<view class="fixed">
			<cu-custom :isBack="true" bgColor="text-white">
				<block slot="backText">返回</block>
				<block slot="content">部门管理</block>
			</cu-custom>
		</view>
		<!-- 顶部图片 -->
		<view class="UCenter-bg">
			<image src="/static/Logo.png" class="png" mode="widthFix"></image>
			<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
		</view>


		<view class="cu-list menu sm-border card-menu margin-top-xl myBorder">
			<view class="cu-item arrow" v-for="(item,index) in orderList" v-bind:key="item.id">
				<view class="content margin">
					<text class="cuIcon-title text-blue"></text>
					<text class="text ">{{item.orderName}}</text>
				</view>
				<view class="cu-tag bg-blue light round margin-xs">
					{{item.orderTimeBegin}} -- {{item.orderTimeEnd}}
				</view>
			</view>
		</view>
		
		<!-- 底部空白行 -->
		<view class='cu-tabbar-height'></view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: [{
					orderName: "AAA",
					orderTimeBegin: "10:20",
					orderTimeEnd: "11:20",
				}, {
					orderName: "BBB",
					orderTimeBegin: "10:20",
					orderTimeEnd: "11:20",
				}, ]
			}
		},
		onLoad() {
			this.getOrderList().then(res => {
				this.orderList = res
			})
		},
		methods: {
			// 异步加载预约列表
			getOrderList() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: "https://www.fastmock.site/mock/e34be376320e67bcbff402db4095587c/api/getOrderList",
						method: "GET",
						data: {
							"coachID": "Beibei123",
						},
						success: (res) => {
							resolve(res.data.data.orderList)
						},
						fail: (err) => {
							reject(err)
						}
					})

				})
			},

		}
	}
</script>

<style>
	.fixed {
		position: fixed;
		z-index: 99;
	}
</style>
