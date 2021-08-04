<template>
	<view class="bg-white">

		<!-- 顶部导航条 -->
		<view class="fixed">
			<cu-custom :isBack="true" bgColor="text-white">
				<block slot="backText">返回</block>
				<block slot="content">员工管理</block>
			</cu-custom>
		</view>
		<!-- 顶部图片 -->
		<view class="UCenter-bg">
			<image src="/static/Logo.png" class="png" mode="widthFix"></image>
			<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
		</view>


		<!-- 筛选框 -->
		<view class=" flex margin-sm align-center">
			<u-input class="margin-sm" v-model="searchStaff" placeholder="员工名" type="text" :border="true" />
			<u-input class="margin-sm" v-model="searchDepart" placeholder="部门名" type="text" :border="true" />
			<button class="padding cu-btn round bg-gradual-blue shadow margin-tb" @click="isHuman()">筛选</button>
		</view>


		<!-- 员工列表 -->
		<view class="padding-sm ">
			<view class="cu-list menu sm-border card-menu margin-lr myBorder">
				<view class="cu-item">
					<view>
						<text class="cuIcon-circlefill text-red margin-sm"> </text>
						<text class="text-bold">员工列表</text>
					</view>
				</view>
				<view class="cu-item arrow" v-for="(item,index) in StaffList" v-bind:key="item.id" v-if="index < 10">
					<view class="align-center cf" @click="showDetail" :id="index">
						<text class="margin-right-sm cuIcon-title text-blue"></text>
						<text class="text-grey">{{item.name}}</text>
						<text class="margin-left-xl cu-tag bg-blue light round text-sm fr">{{item.depart}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 模态框 -->
		<view class="cu-modal" :class="modalName=='modelDetail'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">Modal标题</view>
					<view class="action" @tap="hideDetail">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					Modal 内容。
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				StaffList: '', // 员工列表
				modalName: '', // 模态框
				nowID: -1, // 展开详情的item
				// 查询条件
				searchStaff: '',
				searchDepart: '',

			}
		},
		onLoad() {
			this.getStaffList().then(res => {
				this.StaffList = res
			})
		},
		// 触底事件
		onReachBottom() {
			console.log('触底加载数据')
		},
		methods: {

			// 异步加载员工列表
			getStaffList() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: "https://www.fastmock.site/mock/e34be376320e67bcbff402db4095587c/api/getStaff",
						method: "GET",
						data: {
							"coachID": "Beibei123",
						},
						success: (res) => {
							resolve(res.data.data.staffList)
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			},
			// 展示详情
			showDetail: function(event) {
				console.log("展示详情视图: ", event.currentTarget.id)
				this.modalName = "modelDetail"
				this.nowID = event.currentTarget.id
			},
			// 隐藏模态框
			hideDetail: function() {
				console.log("隐藏详情视图")
				this.modalName = ""
			},

		}
	}
</script>

<style>

</style>
