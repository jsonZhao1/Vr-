<template>
	<div class="lead-bg">
		<div class="leader-top2">
		  <div class="leader-top-title">
		    <h2>系统帮助</h2>
		    <span>SYSTEM HELP</span>
		  </div>
			<div style="display: flex; align-content: center; float: right">
				<div class="manage" style="margin-right: 20px;">
					<el-image
							@click="toSoftList"
							style="width: 190px; height: 72px; cursor: pointer"
							:src="require('../../assets/images/setting.png')"
							fit="contain"></el-image>
				</div>
				<div>
					<img class="back-img" src="../../assets/images/btn_back@2x.png" alt @click="ToBackView" />
				</div>
			</div>
		</div>
		<div class="slide-box min-height">
		<div class="slide-boxIMg">
			<img src="../../assets/images/btn_video@2x.png" alt="" style="width: 430px;" class="btn_people" @click="go('VideoHelp')">
			<img src="../../assets/images/btn_document@2x.png" alt="" style="width: 430px;" class="btn_start" @click="go('DocumentHelp')">
			<img src="../../assets/images/btn_technical@2x.png" alt="" style="width: 430px;" class="btn_file" @click="go('TechnicalHelp')">
		</div>
		</div>
		<div class="public-bom">
			<img src="../../assets/images/btn_f_screen.png" alt @click="ToIndexView" />
			<img src="../../assets/images/btn_click_lead.png" alt @click="ToLeaderBoard" />
		</div>
		<el-dialog title="管理" :visible.sync="pwdDialogShow" center @close="cancelPwdDialog">
			<el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRule" @submit.native.prevent>
				<el-form-item prop="managePwd">
					<el-input v-model="loginForm.managePwd"
							  @keyup.enter.native="loginClick"
							  type="password"
							  placeholder="请输入管理密码" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button style="width: 120px" type="primary"  @click="loginClick">登录</el-button>
		    </span>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				pwdDialogShow: false,
				loginForm: {
					managePwd: ''
				},
				loginFormRule:{
					managePwd:[{required: true, message: '请输入管理密码', trigger: 'blur'}]
				},
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
			//页面跳转
			go(name) {
				this.$router.push({
					name: name
				});
			},
			toSoftList() {
				if (this.$refs.scrollRef) {
					this.$refs.scrollRef._stopMove();
				}
				this.pwdDialogShow = true;
			},
			cancelPwdDialog() {
				if (this.$refs.scrollRef) {
					this.$refs.scrollRef._startMove();
				}
				this.pwdDialogShow = false;
				this.$refs.loginFormRef.resetFields();
			},
			loginClick() {
				this.$refs.loginFormRef.validate((valid) => {
					if (valid) {
						this.getData('validate_password', {
							password: this.loginForm.managePwd
						}, res=>{
							console.info('res='+res)
							if(res.code == 200) {
								this.$message({
									type: "success",
									message: "登录后台成功"
								});
								this.$router.push({
									name: 'SoftList'
								})
							} else {
								this.$message({
									type: "error",
									message: "密码错误!"
								});
							}
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			}
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
	.leader-top2 {
		border-bottom: 1px solid rgba(255, 255, 255, 0.4);
		padding: 0 22px;
		height: 175px;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.leader-top-title {
		display: flex;
		height: 175px;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		h2 {
			font-size: 42px;
			font-weight: bold;
			color: #fff;
			margin-bottom: 15px;
		}

		span {
			font-size: 14px;
			color: #fff;
			text-transform: uppercase;
		}
	}

	.back-img {
		width: 72px;
		height: 72px;
		cursor: pointer;
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
