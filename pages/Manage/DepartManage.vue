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

		<!-- 空隙行 -->
		<view class='cu-tabbar-height'></view>

		<view class="padding text-center margin-top" v-if="departList.length<=0">
			<view class="padding card-myBorder">
				<view class="padding text-lg">（暂无部门数据）</view>
			</view>
		</view>

		<view v-if="departList.length>0">
			<view class="cu-card">
				<view class="cu-item shadow " v-for="(item,index) in departList" v-bind:key="item.id">
					<!-- 详情视图 -->
					<view class="cu-item padding myBorder" v-if="isDetail  && index==nowID">
						<view class="cf align-center ">
							<view class="margin text-black text-bold text-xl fl" @click="fileDetail" :id="index">
								<text class="cuIcon-title text-blue"></text> {{item.dept_name}}（{{item.dept_number}} 人）
							</view>
							<view class="margin text-black text-bold text-lg text-right cuIcon-fold fr"
								@click="hideDetail" :id="index">
							</view>
						</view>
						<!-- 详情内容 -->
						<view class="margin">
							{{item.depart_detail}}
						</view>
					</view>


					<!-- 简单视图 -->
					<view class="cu-item padding cf align-center card-myBorder" v-else>
						<view class="margin text-white text-bold text-xl fl" @click="fileDetail" :id="index">
							{{item.dept_name}}
						</view>
						<view class="margin text-black text-bold text-lg text-right cuIcon-unfold fr"
							@click="showDetail" :id="index">
						</view>
						<view class="margin cu-tag bg-blue light round fr">
							{{item.dept_number}} 人
						</view>
					</view>

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
				see: true,
				isDetail: false, // 是否展开详情视图
				nowID: -1, // 展开详情的item
				departList: [], // 部门列表
			}
		},
		onLoad() {
			this.getOrderList().then(res => {
				this.departList = res
			})
		},
		// 触底事件
		onReachBottom() {
			console.log('触底加载数据')
		},
		methods: {

			// 展示部门详情视图
			showDetail: function(event) {
				console.log("展示详情视图: ", event.currentTarget.id)
				this.isDetail = true
				this.nowID = event.currentTarget.id
			},

			// 隐藏部门详情视图
			hideDetail: function() {
				console.log("隐藏详情视图")
				this.isDetail = false
			},

			// 异步加载预约列表
			getOrderList() {
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '加载中'
					})
					uni.request({
						url: "https://www.fastmock.site/mock/e34be376320e67bcbff402db4095587c/api/getDept",
						method: "POST",
						success: (res) => {
							uni.hideLoading()
							resolve(res.data.data.deptList)
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
