<template>
	<view class="bg-white">

		<!-- 顶部导航条 -->
		<view class="fixed">
			<cu-custom :isBack="true" bgColor="text-white">
				<block slot="backText">返回</block>
				<block slot="content">公告管理</block>
			</cu-custom>
		</view>
		<!-- 顶部图片 -->
		<view class="UCenter-bg">
			<image src="/static/Logo.png" class="png" mode="widthFix"></image>
			<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
		</view>

		<button class="flex margin-lg padding-lg cu-btn line-orange shadow radius text-lg" @click="addNotice()">
			<text class="cuIcon-roundadd margin"></text>
			添 加 公 告
		</button>


		<!-- 公告列表 -->
		<view class="padding-sm ">
			<view class="cu-list menu sm-border card-menu margin-lr myBorder">
				<!-- 列表头 -->
				<view class="cu-item">
					<view>
						<text class="cuIcon-circlefill text-red margin-sm"> </text>
						<text class="text-bold">公告列表</text>
					</view>
					<view class="cu-tag round light bg-white" @click="change_isEdit" v-if="!isEdit">
						<view class="cuIcon-moreandroid text-bold text-blue margin-right-sm"></view>
					</view>
					<view class="cu-tag round light bg-red" @click="change_isEdit" v-else>
						<view class="cuIcon-close text-red margin-right-sm"></view> 删除
					</view>
				</view>
				<!-- 列表体 -->
				<view class="cu-item arrow" v-for="(item,index) in NoticeList" v-bind:key="item.id">
					<view class="align-center cf">
						<checkbox class="margin-right-sm" :class="item.checked?'checked':''"
							:checked="item.checked?true:false" v-if="isEdit" @tap="CheckboxChange(item)">
						</checkbox>
						<text class="margin-right-sm cuIcon-title text-blue" v-else></text>
						<text class="text-bold text-lg" @click="showDetail(item)">{{item.title}}</text>
						<text class="cuIcon-file text-blue text-xl padding-left-sm" v-if="item.isaccessory==1"></text>
						<text class="text-grey"
							@click="showDetail(item)">（{{item.loginname}}）-{{item.create_date.split('T')[0]}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="bottom-text" v-if="pageNum >= allPages">
			<text>已经到底了~</text>
		</view>


		<!-- 模态框 -->
		<view class="cu-modal show" v-if="modalName=='modelDetail'" @tap="hideDetail()">
			<view class="cu-dialog bg-white">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{nowNotice.title}} </view>
					<view class="action" @tap="hideDetail">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="content">
					<text class="margin-right">{{nowNotice.loginname}} </text>
					<text class="margin-left">{{nowNotice.create_date.split('T')[0]}} </text>
				</view>
				<!-- 展示信息 -->
				<scroll-view class="padding margin text-left noticeBorder notice-content">
					<view class="margin-sm"> {{nowNotice.content}}</view>
					<!-- 公告附件 -->
					<view class="text-center">
						<image class="accessory" :src="'data:image/jpeg;base64,'+ nowNotice.accessory" mode="aspectFill"
							v-if="nowNotice.isaccessory==1"></image>
					</view>
				</scroll-view>
				<button class="padding cu-btn round line-orange shadow margin-bottom"
					@click="updateNotice()">修改公告信息</button>
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
				NoticeList: '', // 公告列表
				modalName: '', // 模态框
				nowNotice: '', // 展开详情的notice
				isEdit: false, // 是否编辑
				// 分页查询
				pageNum: 1,
				pageSize: 10,
				allPages: 10000, // 总页数
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.pageNum = 1
			console.log("触发下拉刷新")
			this.getNoticeList().then(res => {
				this.NoticeList = res
			})
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onShow() {
			this.pageNum = 1
			console.log("触发onShow")
			this.getNoticeList().then(res => {
				this.NoticeList = res
			})
		},
		// 触底事件
		onReachBottom() {
			console.log('触底加载数据', this.pageNum)
			this.getNoticeList().then(res => {
				this.pageNum = this.pageNum + 1
				this.NoticeList = this.NoticeList.concat(res)
			})
		},
		methods: {
			// 加载公告列表
			getNoticeList() {
				return new Promise((resolve, reject) => {
					if (this.pageNum < this.allPages) {
						uni.showLoading({
							title: '加载中'
						})
						uni.request({
							url: this.$store.state.apiPath + "/notice/queryAll",
							method: "POST",
							data: {
								pageNum: this.pageNum,
								pageSize: this.pageSize
							},
							success: (res) => {
								this.allPages = res.data.allPages
								console.log(res)
								var noticeList = res.data.notices
								noticeList.forEach(item => {
									item.checked = false
								})
								uni.hideLoading()
								resolve(noticeList)
							},
							fail: (err) => {
								reject(err)
							}
						})
					}
				})
			},

			// 展示详情
			showDetail(item) {
				console.log("展示详情视图: ", item)
				uni.showLoading({
					title: '加载中'
				})
				uni.request({
					url: this.$store.state.apiPath + "/notice/queryById",
					method: "POST",
					data: {
						notice_id: item.notice_id
					},
					success: (res) => {
						console.log(res)
						this.modalName = "modelDetail"
						this.nowNotice = res.data.notice
						this.$store.dispatch('notice/Cache', res.data.notice)
						uni.hideLoading()
					},
				})
			},


			// 删除公告
			delNotice() {
				this.pageNum = 1
				var delList = []
				var that = this
				this.NoticeList.forEach(item => {
					if (item.checked) {
						delList.push(item.notice_id)
					}
				})
				console.log(delList)
				uni.request({
					url: this.$store.state.apiPath + "/notice/delete",
					method: "POST",
					data: {
						"list": delList
					},
					success: (res) => {
						console.log(res)
						this.getNoticeList().then(res => {
							this.NoticeList = res
						})
						uni.hideLoading()
					},
				})
			},

			// 修改公告信息
			updateNotice() {
				this.hideDetail()
				uni.navigateTo({
					url: 'NoticeDetail'
				})
			},

			// 添加公告信息
			addNotice() {
				uni.navigateTo({
					url: 'NoticeAdd'
				})
			},

			// 复选框
			CheckboxChange(item) {
				item.checked = !item.checked
			},

			// 切换编辑状态
			change_isEdit() {
				if (this.isEdit) {
					this.delNotice()
				}
				this.isEdit = !this.isEdit
			},

			// 隐藏模态框
			hideDetail() {
				console.log("隐藏详情视图")
				this.nowNotice = ''
				this.modalName = ''
			},

		}
	}
</script>

<style>
	.accessory {
		height: 200rpx;
		width: 200rpx;
		margin-left: auto;
		margin-right: auto;
	}

	/* 橘色圆角边框 */
	.noticeBorder {
		border-radius: 30rpx;
		border-style: solid;
		border-color: #f37b1d;
		border-width: 1.5px;
	}

	/* 公告内容 */
	.notice-content {
		width: 90%;
		height: 400rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
	}
</style>
