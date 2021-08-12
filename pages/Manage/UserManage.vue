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


		<!-- 已删除用户列表 -->
		<view class="padding-sm ">
			<view class="cu-list menu sm-border card-menu margin-lr myGreyBorder">
				<!-- 列表头 -->
				<view class="cu-item">
					<view>
						<text class="cuIcon-circlefill text-grey margin-sm"> </text>
						<text class="text-bold text-grey">用户回收站</text>
					</view>
				</view>
				<!-- 列表体 -->
				<view class="cu-item arrow" v-for="(item,index) in RecycleList" v-bind:key="item.id">
					<view class="align-center cf">
						<view class="cu-avatar sm round" v-if="!item.photo">
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
		<view class="cu-modal show" v-if="modalName=='modelDetail'">
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
				<view class="padding margin text-left " @tap="hideDetail" v-if="!isUpdate"
					:class="nowUser.del==0?'userBorder':'myGreyBorder text-gray'">
					<view class="margin-sm">
						<text class="cuIcon-peoplefill margin-right-sm"
							:class="nowUser.del==0?'text-orange':'text-gray'"></text>
						用户名：{{nowUser.loginname}}
					</view>
					<view class="margin-sm">
						<text class="cuIcon-newsfill margin-right-sm"
							:class="nowUser.del==0?'text-orange':'text-gray'"></text>
						邮箱：{{nowUser.email}}
					</view>
				</view>
				<!-- 修改信息 -->
				<view class="padding margin text-left userBorder" v-else>
					<view class="cu-form-group">
						<view class="title"><text class="cuIcon-peoplefill margin-right-sm text-orange"></text>姓名
						</view>
						<u-input v-model="nowUser.username" placeholder="请输入用户名" type="text" :border="true" />
					</view>
					<view class="cu-form-group">
						<view class="title"><text class="cuIcon-newsfill margin-right-sm text-orange"></text>密码
						</view>
						<u-input v-model="nowUser.password" placeholder="请输入密码" type='password' :border="true" />
					</view>
					<view class="cu-form-group">
						<view class="title"><text class="cuIcon-repairfill margin-right-sm text-orange"></text>权限
						</view>
						<!-- 权限选择 -->
						<u-radio-group v-model="nowUser.status" @change="radioGroupChange" class="margin-left-lg">
							<u-radio v-for="(item, index) in statuslist" :key="index" :name="item.name"
								:disabled="item.disabled">
								<text>{{item.name==0?'用户':'管理员'}}</text>
							</u-radio>
						</u-radio-group>
					</view>
					<view class="cu-form-group">
						<view class="title"><text class="cuIcon-emojiflashfill margin-right-sm text-orange"></text>点击修改头像
						</view>
						<view class="cu-avatar radius" v-if="nowUser.photo==''" @tap="ChooseImage">
							<text class="cuIcon-people"></text>
						</view>
						<view v-else class="cu-avatar radius margin-left"
							:style="[{ backgroundImage:'url(' + 'data:image/jpeg;base64,'+ nowUser.photo+ ')' }]" @tap="ChooseImage">
						</view>
					</view>
				</view>

				<button class="padding cu-btn round line-green shadow margin-bottom" @click="subUpdateUser()"
					v-if="isUpdate">提交修改</button>
				<button class="padding cu-btn round line-orange shadow margin-bottom" @click="updateUser()"
					v-else-if="nowUser.del==0">修改用户信息</button>
				<button class="padding cu-btn round line-olive shadow margin-bottom" @click="withdrawDeleteUser()"
					v-else>撤销删除</button>
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
				statuslist: [{
						name: 0,
						disabled: false
					},
					{
						name: 1,
						disabled: false
					}
				], // 性别列表
				colorList: this.$store.state.colorList, // 颜色列表
				UserList: '', // 用户列表
				RecycleList: '', // 回收站用户列表
				modalName: '', // 模态框
				nowUser: '', // 展开详情
				isEdit: false, // 是否编辑
				isUpdate: false, // 是否修改用户信息
				searchLoginname: '', // 查询条件
				searchEmail: '', // 查询条件
				sumUser: 0, // 用户总数
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			console.log("触发下拉刷新")
			this.refresh()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onShow() {
			console.log("触发onShow")
			this.refresh()
		},

		methods: {
			// 刷新
			refresh() {
				this.getUserList().then(res => {
					this.UserList = res
				})
				this.getRecycleList().then(res => {
					this.RecycleList = res
				})
			},

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

			// 加载回收站用户列表
			getRecycleList() {
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '加载中'
					})
					uni.request({
						url: this.$store.state.apiPath + "/manageUser/queryDeleteUser",
						method: "GET",
						success: (res) => {
							console.log(res)
							var recycleList = res.data.data
							// uni.hideLoading()
							resolve(recycleList)
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			},

			// 修改用户信息
			updateUser() {
				this.isUpdate = true
			},

			// 提交用户修改
			subUpdateUser() {
				uni.showLoading({
					title: '提交中'
				})
				uni.request({
					url: this.$store.state.apiPath + "/manageUser/changeUser",
					method: "POST",
					data: {
						email: this.nowUser.email,
						loginname: this.nowUser.loginname,
						status: this.nowUser.status,
						username: this.nowUser.username,
						password: this.nowUser.password,
					},
					success: (res) => {
						console.log(res)
						this.refresh()
						uni.hideLoading()
						this.hideDetail()
					},
				})
			},
			
			// 上传头像
			ChooseImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						const tempFilePaths = res.tempFilePaths;
						uni.showLoading({
							title: '上传中'
						})
						uni.uploadFile({
							url: this.$store.state.apiPath + "/user/photoUpload",
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								'loginname': this.nowUser.loginname,
								'email': this.nowUser.email
							},
							success: (res) => {
								var res = JSON.parse(res.data)
								console.log(res)
								uni.hideLoading()
								this.nowUser.photo = res.data.photo
							}
						})
					}
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
						delList.push({
							"loginname": item.loginname
						})
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
						this.refresh()
						uni.hideLoading()
					},
				})
			},

			// 撤销删除用户
			withdrawDeleteUser() {
				var withdrawList = []
				withdrawList.push({
					"loginname": this.nowUser.loginname
				})
				uni.request({
					url: this.$store.state.apiPath + "/manageUser/withdrawDeleteUser",
					method: "POST",
					data: {
						list: JSON.stringify(withdrawList)
					},
					success: (res) => {
						console.log(res)
						this.refresh()
						uni.hideLoading()
					},
				})
			},

			// 复选框
			CheckboxChange(item) {
				item.checked = !item.checked
			},

			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				console.log("修改权限：", this.nowUser.status);
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
			backIndex() {
				uni.navigateTo({
					url: "index"
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
