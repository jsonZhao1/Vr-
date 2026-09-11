<template>
	<div>
		<el-dialog title :visible.sync="visible" width="30%" :before-close="modalClose" :close-on-click-modal="false"
		 :close-on-press-escape="false">
			<span>这是一段信息</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "video-dialog",
		props: {
			visible: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				//   dialogVisible: false
			};
		},
		methods: {
			modalClose() {
				this.$emit("update:visible", false);
			}
		}
	};
</script>

<style lang="scss">
</style>
