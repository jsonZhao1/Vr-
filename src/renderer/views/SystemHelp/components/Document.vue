<template>
	<div class="lead-bg">
		<div class="leader-top">
		  <div class="leader-top-title">
		    <h2>文档教程</h2>
		    <span>DOCUMENT THE TUTORIAL</span>
		  </div>
		  <img src="../../../assets/images/btn_back@2x.png" alt @click="ToBackView" />
		</div>
		<div class="slide-box boxItem">
			<iframe :src="pdfSrc" style="border: 1px solid #ccc;" height="600px" width="1000px"></iframe>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				pdfSrc: ''
			}
		},
		components: {
		},
		created() {
			this.getData('help_config', {}, res => {
				console.info('res='+res)
				if(res.data && res.data.documentPath) {
					this.pdfSrc = res.data.documentPath
				}
			})
		},
		methods:{
			// 首页
			ToIndexView(){
				this.$router.push({
				  name: "index"
				});
			},
			// 点击返回上一级
			ToBackView() {
			  this.$router.go(-1);
			},

			handleBeforePreview(){
				console.info('预览前')
			},
			handlePreviewing(){
				console.info('文件打开时')
			},
			handleSuccessPreview(){
				console.info('成功打开文件')
			},
			handleFailPreview(){
				console.info('失败打开文件')
			},
			handleFinishViewer(){
				console.info('结束预览了')
			},
			handleCloseViewer(){
				this.isShowViewer = false;
			}
		}
	}
</script>

<style scoped>
	.lead-bg {
	  width: 100%;
	  background: url("../../../assets/images/index_bg.png") no-repeat center;
	  padding: 0 60px;
	  height: 1080px;
	  position: relative;
	}
	.boxItem {
		width: 1200px;
		height: 750px;
		margin: 50px auto;
		border-radius: 20px;
		background-color: #ffffff;
		padding: 80px;
	}

</style>
