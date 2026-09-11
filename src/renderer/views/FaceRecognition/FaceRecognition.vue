<template>
	<div class="lead-bg">
		<div class="leader-top">
			<div class="leader-top-title">
				<h2>进入培训</h2>
				<span>Real-name training</span>
			</div>
			<img src="../../assets/images/btn_back@2x.png" alt @click="ToBackView" />
		</div>
		<div class="slide-box boxItem">
			<div class="boxItem_top">
				<img src="../../assets/images/icon_s_video_no.png" alt="">
				<span>设备未就绪</span>
				<span>(请检查您的设备是否正常连接) </span>
			</div>
			<div class="boxItem_center">
				<div>正在进行人脸匹配录入，请保持适合距离，正视摄像头</div>
				<img src="../../assets/images/icon_hint(1).png" alt="" />
				<span>只有录入过人脸信息的用户才可以通过人脸识别进入培训</span>
				<div class="boxItem_centerBox">
					<img src="../../assets/images/img_face.png" alt="" />
					<div>与身份证信息匹配成功</div>
				</div>
				<el-button @click="RecognitionResult">确定录入</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			// 点击返回上一级
			ToBackView() {
				this.$router.go(-1);
			},
			// 确定录入
			RecognitionResult(){
				this.$router.push({
					name:'RecognitionResult'
				})
			}
		}
	}
</script>

<style scoped="scoped">
	.boxItem {
		width: 1200px;
		height: 710px;
		margin: 50px auto;
		background-color: #ffffff;
		border-radius: 15px;
		padding: 20px 20px;
	}

	.boxItem_top {
		width: 340px;
		height: 70px;
		padding-top: 10px;
	}

	.boxItem_top img {
		display: inline-block;
		float: left;
	}

	.boxItem_top span:nth-child(2) {
		display: block;
		float: left;
		margin-top: 10px;
		color: #FC2C2C;
	}

	.boxItem_top span:nth-child(3) {
		display: block;
		margin-top: 10px;
		color: #9AAAB0;
	}

	.boxItem_center {
		text-align: center;
	}
	.boxItem_center div{
		margin-top:50px;
		font-size: 24px;
	}
	.boxItem_center img:nth-child(2){
		width: 18px;
		height: 18px;
	}
	.boxItem_center span{
		color: #9AAAB0;
	}
	.boxItem_centerBox img{
		margin-top: 20px;
	}
	.boxItem_centerBox div{
		font-size: 14px;
		color: #FC2C2C;
		margin:10px;
	}
	.boxItem_center button{
		border: none;
		outline: none;
		margin-top: 10px;
		background-color: #2BB9FC !important;
		color:#FFFFFF !important; 
	}
</style>
