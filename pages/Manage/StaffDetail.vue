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


		<!-- 修改信息 -->
		<view class="padding-xl text-left">
			<view class="margin-sm text-bold text-lg"> <text
					class="cuIcon-peoplefill text-orange margin-right-sm"></text>员工 ID：{{nowStaff.emp_id}}<text
					class='margin-left'
					:class="nowStaff.emp_id==0?'cuIcon-male text-blue':'cuIcon-female text-pink'"></text>
			</view>
			<view class="cu-form-group">
				<view class="title"><text class="cuIcon-peoplefill text-green margin-right-sm"></text>姓名：</view>
				<input v-model="nowStaff.emp_name" placeholder="(请填写姓名)" type="text"></input>
				<picker @change="deptPickerChange" :value="deptIndex" :range="deptPicker">
					<view class="picker text-left">
						{{nowStaff.dept_name==''?'(请选择部门)':nowStaff.dept_name}}
					</view>
				</picker>
			</view>

			<view class="cu-form-group">
				<view class="title"><text class="cuIcon-dianhua text-green margin-right-sm"></text>电话：</view>
				<input v-model="nowStaff.phone" placeholder="(请填写电话)" type="text"></input>
			</view>
			<view class="cu-form-group">
				<view class="title"><text class="cuIcon-newsfill text-green margin-right-sm"></text>邮箱：</view>
				<input v-model="nowStaff.email" placeholder="(请填写邮箱)" type="text"></input>
			</view>
			<view class="cu-form-group">
				<view class="title"><text class="cuIcon-homefill text-green margin-right-sm"></text>地址：</view>
				<input v-model="nowStaff.address" placeholder="(请填写地址)" type="text"></input>
			</view>
			<view class="cu-form-group">
				<view class="title"><text class="cuIcon-medalfill text-green margin-right-sm"></text>学历：</view>
				<input v-model="nowStaff.speciality" placeholder="(专业)" type="text"></input>
				<picker @change="eduPickerChange" :value="eduIndex" :range="eduPicker">
					<view class="picker">
						{{nowStaff.education==''?'(请选择学历)':nowStaff.education}}
					</view>
				</picker>
			</view>
		</view>
		<view class="text-center">
			<button class="padding cu-btn round line-orange shadow margin" @click="updateStaffSubmit()">确认修改</button>
		</view>
		
		<!-- 消息提示框 -->
		<u-toast ref="uToast" />
		<!-- 空白行 -->
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
			nowStaff: state => state.staff
		}),
		data() {
			return {
				eduPicker: ['高中及以下', '本科', '硕士', '博士及以上'],
				eduIndex: -1,
				deptPicker: ['人事部', '公关部', '办公室', '宣传部'],
				deptIndex: -1,
			}
		},
		methods: {
			// 学历选择
			eduPickerChange(e) {
				this.nowStaff.education = this.eduPicker[e.detail.value]
			},
			// 部门选择
			deptPickerChange(e) {
				this.nowStaff.dept_name = this.deptPicker[e.detail.value]
			},

			// 提交员工修改信息
			updateStaffSubmit() {

			},
		}
	}
</script>

<style>

</style>
