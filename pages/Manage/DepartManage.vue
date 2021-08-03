<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view slot="content">部门管理</view>
		</cu-custom>

		<view class="cu-list menu sm-border card-menu margin-top ">
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

</style>
