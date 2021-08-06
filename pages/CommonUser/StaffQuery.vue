<template>
	<view class="bg-white">

		<!-- 顶部导航条 -->
		<view class="fixed">
			<cu-custom :isBack="true" bgColor="text-white">
				<block slot="backText">返回</block>
				<block slot="content">员工查询</block>
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
				</view>

				<view class="cu-item arrow" v-for="(item,index) in StaffList" v-bind:key="item.id">
					<view class="align-center cf">
						<text class="margin-right-sm cuIcon-title text-blue"></text>
						<text class="text-grey" @click="showDetail(item)" :id="index">{{item.emp_name}}</text>
						<text
							:class="'margin-left-xl cu-tag light round text-sm fr bg-'+colorList[item.dept_id]">{{item.dept_name}}</text>
					</view>
				</view>
				-
			</view>
		</view>

		<!-- 模态框 -->
		<view class="cu-modal" :class="modalName=='modelDetail'?'show':''" @tap="hideDetail()">
			<view class="cu-dialog bg-white">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{nowStaff.emp_name}} <text
							:class="'margin-left-sm cu-tag light round text-sm bg-'+colorList[nowStaff.dept_id]">{{nowStaff.dept_name}}</text>
					</view>
					<view class="action" @tap="hideDetail">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<!-- 展示信息 -->
				<view class="padding margin text-left staffBorder">
					<view class="margin-sm">
						<text class="cuIcon-peoplefill text-orange margin-right-sm"></text>员工ID：{{nowStaff.emp_id}}<text
							class='margin-left' :class="nowStaff.sex==0?'cuIcon-male text-blue':'cuIcon-female text-pink'"></text>
					</view>
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

			</view>
		</view>

		<!-- 空隙行 -->
		<view class='cu-tabbar-height'></view>
		<view class='cu-tabbar-height'></view>
		<view class='cu-tabbar-height'></view>
		<view class='cu-tabbar-height'></view>
		<view class='cu-tabbar-height'></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				colorList: this.$store.state.colorList, // 颜色列表
				StaffList: '', // 员工列表
				modalName: '', // 模态框
				nowStaff: '', // 展开详情的staff
				searchStaff: '', // 查询条件
				searchDepart: '', // 查询条件
				// 分页查询
				pageNum: 1,
				pageSize: 10,
			}
		},
		onLoad() {
			this.getStaffList().then(res => {
				this.StaffList = res
			})
		},
		// 触底事件
		onReachBottom() {
			console.log('触底加载数据', this.pageNum)
			this.getStaffList().then(res => {
				this.pageNum = this.pageNum + 1
				this.StaffList = this.StaffList.concat(res)
			})
		},
		methods: {

			// 异步加载员工列表
			getStaffList() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: this.$store.state.apiPath + "/employee/query2",
						method: "POST",
						data: {
							"pageNum": this.pageNum,
							"pageSize": this.pageSize,
							"emp_name": this.searchStaff,
							"dept_name": this.searchDepart
						},
						success: (res) => {
							var staffList = res.data.employees
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
				this.pageNum = 1	// 页码数归零
				this.getStaffList().then(res => {
					this.StaffList = res
				})
			},

			// 展示详情
			showDetail(item) {
				console.log("展示详情视图: ", item.emp_name)
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
/* 橘色圆角边框 */
.staffBorder {
	border-radius: 30rpx;
	border-style: solid;
	border-color: #f37b1d;
	border-width: 1.5px;
}
</style>
