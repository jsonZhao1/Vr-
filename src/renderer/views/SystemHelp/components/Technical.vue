<template>
	<div class="lead-bg">
		<div class="leader-top">
		  <div class="leader-top-title">
		    <h2>技术支持</h2>
		    <span>DOCUMENT THE TUTORIAL</span>
		  </div>
		  <img src="../../../assets/images/btn_back@2x.png" alt @click="ToBackView" />
		</div>
		<div class="slide-box boxItem">
			<el-image
					style="width: 266px; height: 266px"
					:src="require('../../../assets/images/qrcode.png')"
					fit="cover"></el-image>

			<p style="margin-top: 20px">扫描上面二维码加</p>
			<p>售后技术微信咨询</p>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{

			}
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
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		letter-spacing: 10px;
		font-size: 20px;
	}

</style>
