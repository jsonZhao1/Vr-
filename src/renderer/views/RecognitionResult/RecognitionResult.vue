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
				<span>识别结果</span>
			</div>
			<div class="boxItem_result">
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
					<img :src="image?image:'../../assets/images/img_face.png'" id="img" alt="">
				</div>
				<div class="boxItem_button">
					<el-button @click="Training">进入培训({{count}}s)</el-button>
					<el-button icon="el-icon-user-solid" @click="FaceRecognition" disabled>录入人脸</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				table: {
					name: '',
					sex: '',
					nation: '',
					birthday: '',
					address: '',
					idCardNo: ''
				},
				uid: '',
				image: '',
				status: '',
				userInfo: null,
				count: 3
			}
		},
		created() {
			const image = localStorage.getItem('image')
			const uid = localStorage.getItem('uid')
			const userInfo = JSON.parse(localStorage.getItem('userInfo'))
			console.log('获取到人员信息', userInfo)
			this.userInfo = userInfo
			this.image = image
			this.uid = uid
			this.table = userInfo
			const TIME_COUNT = 3;
			if (!this.timer) {
				this.count = TIME_COUNT;
				this.show = false;
				this.timer = setInterval(() => {
					if (this.count > 0 && this.count <= TIME_COUNT) {
						this.count--;
					} else {
						this.show = true;
						clearInterval(this.timer);
						this.timer = null;
						//跳转的页面写在此处
						// const parmas = {
						// 	uid: this.userInfo._id,
						// 	idCardNo: this.userInfo.idCard,
						// }
						// this.getData('add_train', parmas, res => {
						// 	console.log('进入培训', parmas, res)
						// 	if (res.code == 200) {
						// 		this.$router.push({
						// 			name: 'Training'
						// 		})
						// 	} else {
						// 		this.$message.error(res.message || '进入培训失败');
						// 	}
						// })
						this.Training()
					}
				}, 1000)
			}

		},
		methods: {
			// 点击返回上一级
			ToBackView() {
				this.$router.go(-1);
			},
			// 录入人脸
			FaceRecognition() {
				this.$router.push({
					name: 'FaceRecognition'
				})
			},
			// 进入培训
			Training() {
				console.log(111111)
				const parmas = {
					uid: this.userInfo._id,
					idCardNo: this.userInfo.idCardNo,
				}
				this.getData('add_train', parmas, res => {
					console.log('进入培训', parmas, res)
					if (res.code == 200) {
						if (this.timer) {
							clearInterval(this.timer);
						}
						this.$router.push({
							name: 'Training'
						})
					} else {
						this.$message.error(res.message || '进入培训失败');
					}
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

	.boxItem_result {
		width: 680px;
		height: 240px;
		margin: 120px auto;
		border: 1px solid #EBF6FB;
		font-size: 14px;
	}

	.boxItem_result table {
		line-height: 36px;
		font-size: 14px;
		text-align: left;
		text-indent: 20px;
		color: #60676A !important;
	}

	.boxItem_img {
		position: relative;
	}

	.boxItem_img img {
		width: 140px;
		height: 145px;
		position: absolute;
		top: -230px;
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
