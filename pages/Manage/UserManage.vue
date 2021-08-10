<template>
	<view class="bg-white">

		<!-- 顶部导航条 -->
		<view class="fixed">
			<cu-custom :isBack="true" bgColor="text-white">
				<block slot="backText">返回</block>
				<block slot="content">用户管理</block>
			</cu-custom>
		</view>
		<!-- 顶部图片 -->
		<view class="UCenter-bg">
			<image src="/static/Logo.png" class="png" mode="widthFix"></image>
			<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
		</view>

		<!-- 筛选框 -->
		<view class=" flex margin-sm align-center">
			<u-input class="margin-sm" v-model="searchLoginname" placeholder="用户名" type="text" :border="true" />
			<u-input class="margin-sm" v-model="searchEmail" placeholder="邮箱" type="text" :border="true" />
			<button class="padding cu-btn round bg-gradual-blue shadow margin-tb" @click="queryUser()">筛选</button>
		</view>

		<!-- 用户列表 -->
		<view class="padding-sm ">
			<view class="cu-list menu sm-border card-menu margin-lr myBorder">
				<!-- 列表头 -->
				<view class="cu-item">
					<view>
						<text class="cuIcon-circlefill text-red margin-sm"> </text>
						<text class="text-bold">用户列表（总数：{{sumUser}}）</text>
					</view>
					<view class="cu-tag round light bg-white" @click="change_isEdit" v-if="!isEdit">
						<view class="cuIcon-moreandroid text-bold text-blue margin-right-sm"></view>
					</view>
					<view class="cu-tag round light bg-red" @click="change_isEdit" v-else>
						<view class="cuIcon-close text-red margin-right-sm"></view> 删除
					</view>
				</view>
				<!-- 列表体 -->
				<view class="cu-item arrow" v-for="(item,index) in UserList" v-bind:key="item.id">
					<view class="align-center cf">
						<checkbox class="margin-right-sm" :class="item.checked?'checked':''"
							:checked="item.checked?true:false" v-if="isEdit" @tap="CheckboxChange(item)">
						</checkbox>
						<!-- <text class="margin-right-sm cuIcon-title text-blue" v-else></text> -->
						<view class="cu-avatar sm round" v-else-if="!item.photo">
							<text class="cuIcon-people"></text>
						</view>
						<view v-else class="cu-avatar sm round"
							:style="[{ backgroundImage:'url(' + 'data:image/jpeg;base64,'+ item.photo+ ')' }]">
						</view>
						<text class="text-bold text-lg margin-left" @click="showDetail(item)">{{item.username}} </text>
						<text class="text-grey" @click="showDetail(item)"> （{{item.loginname}})</text>
						<text class="margin-left cu-tag light round text-sm fr bg-orange"
							v-if="item.status==1">管理员</text>
					</view>
				</view>
			</view>
		</view>

		<view class="bottom-text">
			<text>已经到底了~</text>
		</view>


		<!-- 模态框 -->
		<view class="cu-modal show" v-if="modalName=='modelDetail'" @tap="hideDetail()">
			<view class="cu-dialog bg-white">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{nowUser.username}}
						<text class="margin-left-sm cu-tag light round text-sm bg-orange"
							v-if="nowUser.status==1">管理员</text>
						<text class="margin-left-sm cu-tag light round text-sm bg-green" v-else>普通用户</text>
					</view>
					<view class="action" @tap="hideDetail">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<!-- 展示信息 -->
				<view class="padding margin text-left userBorder">
					<view class="margin-sm">
						<text class="cuIcon-peoplefill text-orange margin-right-sm"></text>用户名：{{nowUser.loginname}}
					</view>
					<view class="margin-sm"> <text
							class="cuIcon-newsfill text-orange margin-right-sm"></text>邮箱：{{nowUser.email}}</view>
				</view>

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
		// VueX 连接 notice
		computed: mapState({
			notice: state => state.notice
		}),
		data() {
			return {
				colorList: this.$store.state.colorList, // 颜色列表
				UserList: '', // 用户列表
				modalName: '', // 模态框
				nowUser: '', // 展开详情
				isEdit: false, // 是否编辑
				searchLoginname: '', // 查询条件
				searchEmail: '', // 查询条件
				sumUser: 0, // 用户总数
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			console.log("触发下拉刷新")
			this.getUserList().then(res => {
				this.UserList = res
			})
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onShow() {
			console.log("触发onShow")
			this.getUserList().then(res => {
				this.UserList = res
			})
		},

		methods: {
			// 加载用户列表
			getUserList() {
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '加载中'
					})
					uni.request({
						url: this.$store.state.apiPath + "/manageUser/queryUser",
						method: "POST",
						data: {
							loginname: this.searchLoginname,
							email: this.searchEmail
						},
						success: (res) => {
							console.log(res)
							this.sumUser = res.data.number
							var userList = res.data.data
							userList.forEach(item => {
								item.checked = false
							})
							uni.hideLoading()
							resolve(userList)
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			},

			// 筛选用户
			queryUser() {
				this.getUserList().then(res => {
					this.UserList = res
				})
			},


			// 删除用户
			delUser() {
				var delList = []
				var that = this
				this.UserList.forEach(item => {
					if (item.checked) {
						delList.push({"loginname":item.loginname})
					}
				})
				console.log("删除列表：", JSON.stringify(delList))
				uni.request({
					url: this.$store.state.apiPath + "/manageUser/deleteUser",
					method: "POST",
					data: {
						list: JSON.stringify(delList)
					},
					success: (res) => {
						console.log(res)
						this.getUserList().then(res => {
							this.UserList = res
						})
						uni.hideLoading()
					},
				})
			},

			// 复选框
			CheckboxChange(item) {
				item.checked = !item.checked
			},

			// 切换编辑状态
			change_isEdit() {
				if (this.isEdit) {
					this.delUser()
				}
				this.isEdit = !this.isEdit
			},

			// 展示详情
			showDetail(item) {
				console.log("展示详情视图: ", item)
				this.nowUser = item
				this.$store.dispatch('notice/Cache', item)
				this.modalName = "modelDetail"
			},

			// 隐藏模态框
			hideDetail() {
				console.log("隐藏详情视图")
				this.nowUser = ''
				this.modalName = ''
			},
			
			// 返回
			backIndex(){
				uni.navigateTo({
					url:"index"
				})
			}

		}
	}
</script>

<style>
	/* 橘色圆角边框 */
	.userBorder {
		border-radius: 30rpx;
		border-style: solid;
		border-color: #f37b1d;
		border-width: 1.5px;
	}
</style>
