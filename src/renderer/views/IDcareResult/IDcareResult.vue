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
				<span>新增人员</span>
			</div>
			<div class="boxItem_center">
				<div>请将二代身份证放置在下方识读区</div>
				<img src="../../assets/images/icon_hint(1).png" alt="" />
				<span>如刷身份证无反应，请与工作人员联系</span>
				<div class="boxItem_centerBox">
					<!-- <el-table :data="tableData" border style="width: 100%" :show-header="false">
						<el-table-column prop="date" width="184"></el-table-column>
						<el-table-column prop="name" width="495"></el-table-column>
					</el-table> -->
					<table>
						<colgroup>
							<col style="background-color:#ECF7FB" />
						</colgroup>
						<tr>
							<td style="width: 200px;">姓名：</td>
							<td style="border-bottom:0.1px solid #ECF7FB;width:550px;text-align: left;">{{table.name}}</td>
						</tr>
						<tr>
							<td style="width: 200px;">性别：</td>
							<td style="border-bottom:0.1px solid #ECF7FB;width:550px;text-align: left;">{{table.sex}}</td>
						</tr>
						<tr>
							<td style="width: 200px;">民族：</td>
							<td style="border-bottom:0.1px solid #ECF7FB;width:550px;text-align: left;">{{table.nation}}</td>
						</tr>
						<tr>
							<td style="width: 200px;">出生日期：</td>
							<td style="border-bottom:0.1px solid #ECF7FB;width:550px;text-align: left;">{{table.birthday}}</td>
						</tr>
						<tr>
							<td style="width: 200px;">住址：</td>
							<td style="border-bottom:0.1px solid #ECF7FB;width:550px;text-align: left;">{{table.address}}</td>
						</tr>
						<tr>
							<td style="width: 200px;">身份证号码：</td>
							<td style="width:550px;text-align: left;">{{table.idCardNo}}</td>
						</tr>
					</table>
					<div class="boxItem_img">
						<img :src="image?image:'../../assets/images/img_face.png'" alt="">
					</div>
					<div class="boxItem_button">
						<el-button @click="Training">新增人员</el-button>
						<el-button icon="el-icon-user-solid" @click="FaceRecognition" disabled>录入人脸</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				table:{
					name:'张三',
					sex:'女',
					nation:'汉',
					birthday:'2000-06-05',
					address:'安徽省合肥市包河区包河互联网产业园',
					idCardNo:'123456789012345678'
				},
				image:''
			}
		},
		created() {
			const image = localStorage.getItem('image')
			const userInfo = JSON.parse(localStorage.getItem('userInfo'))
			this.image = image
			this.table = userInfo
		},
		methods: {
			// 点击返回上一级
			ToBackView() {
				this.$router.go(-1);
			},
			// 进入培训
			Training() {
				const body={
					name:this.table.name ,
					sex:this.table.sex,
					nation:this.table.nation,
					birthday:this.table.birthday,
					address:this.table.address,
					idCardNo:this.table.idCardNo
				}
				this.getData('add_user_info',body,res=>{
					if(res.code == 200){
                        this.$message({
                        	type: "success",
                        	message: "新增人员成功",
                        });
                        this.$router.push({
                        	name: "PersonnelManagement",
                        });
                    }else {
                        this.$message({
                        	type: "error",
                        	message: res.message,
                        });
                    }
				})
			},
			// 录入人脸
			FaceRecognition() {
				this.$router.push({
					name: 'FaceRecognition'
				})
			}
		}
	}
</script>

<style scoped>
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
		font-size: 24px;
	}

	.boxItem_center {
		text-align: center;
	}

	.boxItem_center div {
		margin-top: 50px;
		font-size: 24px;
	}

	.boxItem_center img:nth-child(2) {
		width: 18px;
		height: 18px;
	}

	.boxItem_center span {
		color: #9AAAB0;
	}

	.boxItem_centerBox {
		width: 680px;
		height: 240px;
		margin: 120px auto;
		border: 1px solid #EBF6FB;
		font-size:14px;
	}
	 .boxItem_centerBox table{
		line-height: 36px;
		font-size: 14px;
		text-align: left;
		text-indent:20px;
		color: #60676A !important;
	 }
	.boxItem_img {
		position: relative;
	}

	.boxItem_img img {
		width: 140px;
		height: 145px;
		position: absolute;
		top: -260px;
		right: 20px;
	}

	.boxItem_button {
		margin-top: 40px;
		text-align: center;
	}

	.boxItem_button button {
		width: 180px;
		border: none;
		outline: none;
	}

	.boxItem_button button:nth-child(1) {
		background-color: #2BB9FC !important;
		color: #FFFFFF !important;
	}

	.boxItem_button button:nth-child(2) {
		background-color: #C2E0EE !important;
		color: #102833 !important;
	}

	.el-table_1_column_1 {
		background-color: #ECF7FB !important;
		color: #60686A !important;
	}
</style>
