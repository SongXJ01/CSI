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
			<button class="padding cu-btn round bg-gradual-blue shadow margin-tb" @click="queryStaff()">筛选</button>
		</view>


		<!-- 员工列表 -->
		<view class="padding-sm ">
			<view class="cu-list menu sm-border card-menu margin-lr myBorder">
				<view class="cu-item">
					<view>
						<text class="cuIcon-circlefill text-red margin-sm"> </text>
						<text class="text-bold">员工列表</text>
					</view>
					<view class="cu-tag round light bg-white" @click="change_isEdit" v-if="!isEdit">
						<view class="cuIcon-moreandroid text-bold text-blue margin-right-sm"></view>
					</view>
					<view class="cu-tag round light bg-red" @click="change_isEdit" v-else>
						<view class="cuIcon-close text-red margin-right-sm"></view> 删除
					</view>
				</view>

				<view class="cu-item arrow" v-for="(item,index) in StaffList" v-bind:key="item.id" v-if="index < 10">
					<view class="align-center cf">
						<checkbox class="margin-right-sm" :class="item.checked?'checked':''"
							:checked="item.checked?true:false" v-if="isEdit" @tap="CheckboxChange(item)">
						</checkbox>
						<text class="margin-right-sm cuIcon-title text-blue" v-else></text>
						<text class="text-grey" @click="showDetail(item)">{{item.emp_name}}</text>
						<text class="margin-left-xl cu-tag bg-blue light round text-sm fr">{{item.dept_name}}</text>
					</view>
				</view>

			</view>
		</view>

		<!-- 模态框 -->
		<view class="cu-modal" :class="modalName=='modelDetail'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{nowStaff.emp_name}} <text
							class="margin-left-sm cu-tag bg-blue light round text-sm">{{nowStaff.dept_name}}</text>
					</view>
					<view class="action" @tap="hideDetail">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<!-- 展示信息 -->
				<view class="padding-xl text-left">
					<view class="margin-sm"> <text
							class="cuIcon-dianhua text-orange margin-right-sm"></text>电话：{{nowStaff.phone}}</view>
					<view class="margin-sm"> <text
							class="cuIcon-newsfill text-orange margin-right-sm"></text>邮箱：{{nowStaff.email}}</view>
					<view class="margin-sm"> <text
							class="cuIcon-homefill text-orange margin-right-sm"></text>地址：{{nowStaff.address}}</view>
					<view class="margin-sm">
						<text class="cuIcon-medalfill text-orange margin-right-sm"></text>学历：{{nowStaff.speciality}} -
						{{nowStaff.education}}
					</view>
				</view>
				<button class="padding cu-btn round line-orange shadow margin-bottom" @click="updateStaff()">修改</button>

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
				nowStaff: '', // 展开详情的staff
				searchStaff: '', // 查询条件
				searchDepart: '', // 查询条件
				isEdit: false, // 是否编辑
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
						url: this.$store.state.apiPath + "/employee/query2",
						method: "POST",
						data: {
							"pageNum": 1,
							"pageSize": 20,
							"emp_name": this.searchStaff,
							"dept_name": this.searchDepart
						},
						success: (res) => {
							var staffList = res.data.employees
							staffList.forEach(item => {
								item.checked = false
							})
							resolve(staffList)
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			},

			// 筛选员工
			queryStaff() {
				this.getStaffList().then(res => {
					this.StaffList = res
				})
			},

			// 复选框
			CheckboxChange(item) {
				item.checked = !item.checked
			},

			// 切换编辑状态
			change_isEdit() {
				this.isEdit = !this.isEdit
			},

			// 展示详情
			showDetail(item) {
				console.log("展示详情视图: ", item.name)
				this.nowStaff = item
				this.modalName = "modelDetail"
			},
			// 隐藏模态框
			hideDetail() {
				console.log("隐藏详情视图")
				this.nowStaff = ''
				this.modalName = ''
			},

		}
	}
</script>

<style>

</style>
