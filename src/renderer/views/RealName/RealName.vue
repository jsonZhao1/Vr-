<template>
	<div class="lead-bg">
		<div class="leader-top">
		  <div class="leader-top-title">
		    <h2>实名制培训</h2>
		    <span>Real-name training</span>
		  </div>
		  <img src="../../assets/images/btn_back@2x.png" alt @click="ToBackView" />
		</div>
		<div class="slide-box min-height">
		<div class="slide-boxIMg">
			<img src="../../assets/images/btn_start.png" alt="" style="width: 430px;" class="btn_start" @click="EnterTraining">
			<img src="../../assets/images/btn_people.png" alt="" style="width: 430px;" class="btn_people" @click="PersonnelManagement">
			<img src="../../assets/images/btn_file.png" alt="" style="width: 430px;" class="btn_file" @click="TrainingFile">
		</div>
		</div>
		<div class="public-bom">
			<img src="../../assets/images/btn_f_screen.png" alt @click="ToIndexView" />
			<img src="../../assets/images/btn_click_lead.png" alt @click="ToLeaderBoard" />
			<img src="../../assets/images/btn_system_help.png" alt @click="SystemHelp">
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
				  name: "index",
				});
			},
			// 点击返回上一级
			ToBackView() {
			  this.$router.go(-1);
			},
			// 点击排行榜
			ToLeaderBoard() {
				this.$router.push({
					name: "leader-board"
				});
			},
			// 实名制验证
			RealName(){
				this.$router.push({
					name: "RealName"
				});
			},
			// 进入培训
			EnterTraining(){
				this.$router.push({
					name: "EnterTraining"
				});
			},
			// 人员管理
			PersonnelManagement(){
				this.$router.push({
					name: "PersonnelManagement"
				});
			},
			// 培训档案
			TrainingFile(){
				this.$router.push({
					name: "TrainingFile"
				});
			},
			SystemHelp(){
				this.$router.push({
					name: "SystemHelp"
				});
			},
		}
	}
</script>

<style scoped>
	.lead-bg {
	  width: 100%;
	  background: url("../../assets/images/index_bg.png") no-repeat center;
	  padding: 0 60px;
	  height: 1080px;
	  position: relative;
	}
	.slide-boxIMg{
		width:1300px;
		height:640px;
		cursor: pointer;
		margin:100px auto;
		transition: all .8s;
	}
	.btn_start:hover{
		text-shadow:5px 5px 5px #2BB9FC ;
		transform: scale(1.2);
	}
	.btn_people:hover{
		text-shadow:5px 5px 5px #2BB9FC ;
		transform: scale(1.2);
	}
	.btn_file:hover{
		text-shadow:5px 5px 5px #2BB9FC ;
		transform: scale(1.2);
	}
</style>
