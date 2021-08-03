<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// ColorUI 获取导航栏高度
			uni.getSystemInfo({
				success: function(e) {
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*uView组件库引用*/
	@import "uview-ui/index.scss";
	/*colorui组件库引用*/
	@import "colorui/main.css";
	@import "colorui/icon.css";
	/*自定义CSS库引用*/
	@import "static/util.css";

</style>
