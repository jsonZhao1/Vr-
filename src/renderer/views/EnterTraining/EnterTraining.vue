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
			<div class="IDCard">
				<div class="IDCardBox">
					<div class="IDCardBox_one">
						<!-- <img :src="image" alt="" /> -->
						<img :src="require('../../assets/images/'+imageItem+'.png')" alt="" />
						<span :class="{changeColor:colorFlag}">{{equipment}}</span>
						<span style="color:#9AA9AF;">{{device}}</span>
					</div>
					<div class="IDCardBox_two">
						<span>方法一：刷身份证进入培训</span>
						<div>请将二代身份证放置在下方识读区</div>
						<img src="../../assets/images/icon_hint(1).png" alt="">
						<span>如刷身份证无反应，请与工作人员联系</span>
					</div>
					<div class="IDCardBox_img">
						<img  :src="require('../../assets/images/'+img)" alt="" />
					</div>
				</div>
				<!-- <div class="boxItem_centerBox">
					<el-button @click="box">123</el-button>
				</div> -->
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				readIdFlag: false,
				form: {
					name: '',
					sex: '',
					nation: '',
					birthday: '',
					address: '',
					idCardNo: ''
				},
				uid: '',
				imageItem: 'icon_s_id',
				image: '',
				img: 'img_id_sb.png',
				equipment: '设备未就绪',
				colorFlag: true,
				device: '(请检查您的设备是否正常连接)'
			}
		},
		created() {
			this.loanRead();
		},
		methods: {
			box() {
				this.getData('list_user_info', {}, users => {
					let [userInfo] = users
					console.log('识别到人员信息', userInfo)
					localStorage.setItem('userInfo', JSON.stringify(userInfo))
					this.$router.push({
						name: "RecognitionResult",
					});
				})

			},
			// 点击返回上一级
			ToBackView() {
				this.$router.push({
					name: "RealName",
				});
			},
			// 人脸识别
			FaceRecognition() {
				this.$router.push({
					name: "FaceRecognition",
				});
			},
			loanRead() {
				this.readIdFlag = false
				let self = this;
				self.idTimer = window.setInterval(() => {
					if (self.readIdFlag) {
						return;
					}
					self.ReadIdCard();
				}, 1000);
				this.$once("hook:beforeDestroy", () => {
					window.clearInterval(self.idTimer);
				});
			},
			ReadIdCard() {
				let self = this;
				var websocket = new WebSocket(
					process.env.NODE_ENV === "development" ?
					"ws://127.0.0.1:9000/" :
					"ws://127.0.0.1:9000/"
				);
				websocket.onopen = function(evt) {
					//onOpen(evt)
					console.log(evt, 'onopen')
					websocket.send("<ReadIdCard>");
					self.colorFlag = false;
					self.imageItem = 'icon_s_id'
					self.equipment = '设备已就绪'
					self.device = ''
				};
				websocket.onclose = function(evt) {
					// onClose(evt)
					console.log(evt, 'onclose')
					// self.colorFlag = true;
					// self.imageItem='icon_s_id'
					// self.equipment='设备未就绪'
					// self.device='(请检查您的设备是否正常连接)'
				};
				websocket.onmessage = function(evt) {
					console.log(evt, 'onmessage')
					self.idInfoMessage = "身份证正在读取中..." + new Date().getTime();
					self.img = 'id.gif'
					if (evt.data.indexOf("读卡失败") > -1) {
						self.idInfoMessage = "身份证读卡失败" + new Date().getTime();
					} else {
						self.readIdFlag = true;
						self.matchShow = false;
						self.idInfoMessage = "身份证读取成功";
						self.img = 'img_id_sb.png'
						// 清除定时器
						window.clearInterval(self.idTimer);
						self.idTimer = null;
						// 展示身份证信息
						self.idInfo(evt.data);
						const parmas = {
							name: self.form.name,
							sex: self.form.sex,
							nation: self.form.nation,
							birthday: self.form.birthday,
							address: self.form.address,
							idCardNo: self.form.idCardNo,
							idCardHeadPath: self.image,
							update: true
						}
						console.log('读取到人员信息', parmas)
						self.getData('add_user_info', parmas, res => {
							console.log(res, 11111)
							self.uid = evt.data._id,
								localStorage.setItem('uid', self.uid)
							localStorage.setItem('userInfo', JSON.stringify(res.data))
							localStorage.setItem('image', self.image)
							self.$router.push({
								name: "RecognitionResult",
							});
						})
						websocket.close();
					}
				};
				websocket.onerror = function(evt) {
					self.idInfoMessage = "身份证读取出错"
					websocket.close();
				};
			},
			formatNumber(n) {
				// 把身份证上日期转为时间戳
				let nDate = n.split("");
				let x = nDate.slice(0, 4).join("");
				let y = nDate.slice(4, 6).join("");
				let z = nDate.slice(6, 8).join("");
				return x + "-" + y + "-" + z;
			},
			idInfo(value) {
				console.log(value)
				let str = value.substring(1, value.length - 1);
				this.infoData = str.split(",").slice(2, 13);
				this.infoData.splice(3, 1);
				// 身份证读取之后信息展示
				this.form.name = this.infoData[0];
				this.form.sex = this.infoData[1];
				this.form.nation = this.infoData[2];
				this.form.birthday = this.formatNumber(this.infoData[3]);
				this.form.address = this.infoData[4];
				this.form.idCardNo = this.infoData[5];
				this.form.sign = this.infoData[6];
				this.form.validate =
					this.formatNumber(this.infoData[7]) +
					" 至 " +
					this.formatNumber(this.infoData[8]);
				// 图片base64链接
				this.image =
					"data:image/jpeg;base64," + this.infoData[this.infoData.length - 1];
				// 将身份证上照片放到页面
				/*let img = document.getElementById("image");
				img.src = this.image;*/
				return this.infoData;
			},
			// 离开该组件清除定时器
			beforeDestroy() {
				window.clearInterval(this.idTimer);
				this.idTimer = null;
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
		position: relative;
	}

	.IDCard {
		width: 100%;
		height: 710px;
		float: left;
		border-right: 1px solid #ECF7FB;

	}

	.IDCardBox {
		padding-left: 40px;
		padding-top: 40px;
	}

	.humanFaceBox {
		padding-left: 40px;
		padding-top: 40px;
	}

	.IDCardBox_one {
		width: 260px;
		height: 40px;
	}

	.IDCardBox_one img {
		width: 30px;
		height: 30px;
		display: inline-block;
		float: left;

	}

	.IDCardBox_one span {
		font-size: 12px;
		color: #2BB9FC;
		display: block;
		float: left;
		margin-top: 10px;
	}

	.IDCardBox_two {
		width: 100%;
		height: 100px;
		line-height: 32px;
	}

	.IDCardBox_two span {
		font-size: 20px;
	}

	.IDCardBox_two div {
		padding-left: 80px;
		font-size: 17px;
	}

	.IDCardBox_two img {
		width: 15px;
		height: 15px;
		padding-left: 80px;
	}

	.IDCardBox_two span:nth-child(4) {
		font-size: 13px;
		color: #9AAAB0;
	}

	.IDCardBox_img {
		margin-top: 15px;
	}

	.humanFace {
		width: 50%;
		height: 710px;
		float: left;
	}
	.humanFace_list {
		width:220px;
		height: 40px;
		text-align: center;
		line-height:40px;
		border-radius:4px;
		background: rgba(0,0,0,0.1);
		position: absolute;
		right: 170px;
		bottom: 187px;
		z-index: 9999;
		color:#FC2B2B;
		
	}

	.humanFaceBox_img {
		text-align: center;
		margin: 30px;
	}

	.humanFaceBox_btn {
		text-align: center;
		border: none;
		outline: none;

	}

	.humanFaceBox_btn button {
		background-color: #2CBEFC;
		color: #FFFFFF;
		width: 220px;
	}

	.changeColor {
		color: #FC2B2B !important;
	}
</style>
