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
				<!-- 列表头 -->
				<view class="cu-item">
					<view>
						<text class="cuIcon-circlefill text-red margin-sm"> </text>
						<text class="text-bold">员工列表</text>
						<text @click="addStaff()"
							class="text-bold cuIcon-add cu-tag text-green bg-green light round padding-sm margin-left-sm"></text>
					</view>
					<view class="cu-tag round light bg-white" @click="change_isEdit" v-if="!isEdit">
						<view class="cuIcon-moreandroid text-bold text-blue margin-right-sm"></view>
					</view>
					<view class="cu-tag round light bg-red" @click="change_isEdit" v-else>
						<view class="cuIcon-close text-red margin-right-sm"></view> 删除
					</view>
				</view>
				<!-- 列表体 -->
				<view class="cu-item arrow" v-for="(item,index) in StaffList" v-bind:key="item.id">
					<view class="align-center cf">
						<checkbox class="margin-right-sm" :class="item.checked?'checked':''"
							:checked="item.checked?true:false" v-if="isEdit" @tap="CheckboxChange(item)">
						</checkbox>
						<text class="margin-right-sm cuIcon-title text-blue" v-else></text>
						<text class="text-grey" @click="showDetail(item)">{{item.emp_name}}</text>
						<text
							:class="'margin-left-xl cu-tag light round text-sm fr bg-'+colorList[item.dept_id]">{{item.dept_name}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-text" v-if="pageNum >= allPages">
			<text>已经到底了~</text>
		</view>

		<!-- 信息模态框 -->
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
							class='margin-left'
							:class="nowStaff.sex==0?'cuIcon-male text-blue':'cuIcon-female text-pink'"></text>
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

				<button class="padding cu-btn round line-orange shadow margin-bottom"
					@click="updateStaff()">修改员工信息</button>
			</view>
		</view>


		<!-- 删除模态框 -->
		<view class="cu-modal" :class="modalName=='modelDel'?'show':''" @tap="hideDetail()">
			<view class="cu-dialog bg-white">
				<view class="cu-bar bg-white justify-end">
					<view class="content">删除员工</view>
					<view class="action" @tap="hideDetail">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<!-- 展示信息 -->
				<view class="cu-list menu sm-border card-menu margin-lr">
					<!-- 列表头 -->
					<view class="cu-item">
						<view>
							<text class="cuIcon-question text-red margin-sm"> </text>
							<text class="text-bold">确定要删除下列员工吗？</text>
						</view>
					</view>
					<!-- 列表体 -->
					<view class="cu-item" v-for="(item,index) in delNameList" v-bind:key="item.id">
						<view class="align-center cf">
							<text class="margin-right-sm margin-left cuIcon-title text-orange"></text>
							<text class="text-grey" @click="showDetail(item)">{{item}}</text>
						</view>
					</view>
				</view>
				<button class="padding cu-btn round line-orange shadow margin-bottom" @click="delStaff()">确定删除</button>

			</view>
		</view>

		<!-- 空隙行 -->
		<view class='cu-tabbar-height'></view>
		<view class='cu-tabbar-height'></view>
		<view class='cu-tabbar-height'></view>
	</view>
</template>

<script>
	// 导入 VueX
	import {
		mapState,
		mapActions
	} from 'vuex'
	export default {
		// VueX 连接 staff
		computed: mapState({
			staff: state => state.staff
		}),
		data() {
			return {
				colorList: this.$store.state.colorList, // 颜色列表
				StaffList: [], // 员工列表
				modalName: '', // 模态框
				nowStaff: '', // 展开详情的staff
				searchStaff: '', // 查询条件
				searchDepart: '', // 查询条件
				isEdit: false, // 是否编辑
				// 分页查询
				pageNum: 1,
				pageSize: 10,
				allPages: 10000, // 总页数
				// 删除缓存
				delNameList: '',
				delList: '',
			}
		},
		onShow() {
			this.refresh()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.refresh()
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
			// 刷新
			refresh() {
				this.pageNum = 1
				uni.showLoading({
					title: '加载中'
				})
				uni.request({
					url: this.$store.state.apiPath + "/employee/queryByIdAndDept",
					method: "POST",
					data: {
						pageNum: 1,
						pageSize: this.pageSize,
						emp_name: this.searchStaff,
						dept_name: this.searchDepart
					},
					success: (res) => {
						this.allPages = res.data.allPages
						var staffList = res.data.employees
						staffList.forEach(item => {
							item.checked = false
						})
						this.StaffList = staffList
						uni.hideLoading()
						uni.stopPullDownRefresh()
					},
				})
			},

			// 加载员工列表
			getStaffList() {
				return new Promise((resolve, reject) => {
					if (this.pageNum < this.allPages) {
						uni.showLoading({
							title: '加载中'
						})
						uni.request({
							url: this.$store.state.apiPath + "/employee/queryByIdAndDept",
							method: "POST",
							data: {
								"pageNum": this.pageNum,
								"pageSize": this.pageSize,
								"emp_name": this.searchStaff,
								"dept_name": this.searchDepart
							},
							success: (res) => {
								this.allPages = res.data.allPages
								var staffList = res.data.employees
								staffList.forEach(item => {
									item.checked = false
								})
								uni.hideLoading()
								resolve(staffList)
							},
							fail: (err) => {
								reject(err)
							}
						})
					}
				})
			},

			// 删除员工预处理
			proDel() {
				var delNameList = []
				var delList = []
				this.StaffList.forEach(item => {
					if (item.checked) {
						delNameList.push(item.emp_name)
						delList.push(item.emp_id)
					}
				})
				this.delNameList = delNameList
				this.delList = delList
				this.modalName = "modelDel"
			},

			// 删除员工
			delStaff() {
				console.log(this.delList)
				uni.request({
					url: this.$store.state.apiPath + "/employee/delete",
					method: "POST",
					data: {
						"list": this.delList
					},
					success: (res) => {
						console.log(res)
						uni.hideLoading()
						this.refresh()
					},
				})
			},

			// 修改员工信息
			updateStaff() {
				this.hideDetail()
				uni.navigateTo({
					url: 'StaffDetail'
				})
			},

			// 添加员工信息
			addStaff() {
				uni.navigateTo({
					url: 'StaffAdd'
				})
			},

			// 筛选员工
			queryStaff() {
				this.refresh()
			},

			// 复选框
			CheckboxChange(item) {
				item.checked = !item.checked
			},

			// 切换编辑状态
			change_isEdit() {
				if (this.isEdit) {
					this.proDel()
				}
				this.isEdit = !this.isEdit
			},

			// 展示详情
			showDetail(item) {
				console.log("展示详情视图: ", item.emp_name)
				this.nowStaff = item
				this.$store.dispatch('staff/Cache', item)
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
