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
					<img src="../../assets/images/img_id_sb.png" alt=""  id="image"/>
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
				form:{
					name:'',
					sex:'',
					nation:'',
					birthday:'',
					address:'',
					idCardNo:''
				},
				image: '',
			}
		},
		created() {
			this.loanRead();
		},
		methods: {
			box(){
				this.$router.push({
					name: "IDcareResult",
				});
			},
			// 点击返回上一级
			ToBackView() {
				this.$router.go(-1);
			},
			loanRead() {
				this.readIdFlag = false;
				// 定时器身份证读取
				let self = this;
				self.idTimer = window.setInterval(() => {
					if (self.readIdFlag) {
						return;
					}
					self.ReadIdCard();
					console.log(11);
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
					websocket.send("<ReadIdCard>");
				};
				websocket.onclose = function(evt) {
					//onClose(evt)
				};
				websocket.onmessage = function(evt) {
					self.readIdMessage = "身份证正在读取中..." + new Date().getTime();
					if (evt.data.indexOf("读卡失败") > -1) {
						self.readIdMessage = "身份证读卡失败" + new Date().getTime();
					} else {
						self.readIdFlag = true;
						self.readIdMessage = "身份证读取成功";
						// 清除定时器
						window.clearInterval(self.idTimer);
						self.idTimer = null;
						// 展示身份证信息
						//self.idInfo(evt.data)
						self.idInfo(evt.data);
						localStorage.setItem('userInfo',JSON.stringify(self.form))
						localStorage.setItem('image',self.image)
						self.$router.push({
							name: "IDcareResult",
						});
						websocket.close();
					}
				};
				websocket.onerror = function(evt) {
					self.readIdMessage = "身份证读卡出错";
					websocket.close();
				};
			},
			idInfo(value) {
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
				// 图片base64链接
				this.image =
					"data:image/jpeg;base64," + this.infoData[this.infoData.length - 1];
				// 将身份证上照片放到页面
				var img = document.getElementById("image");
				img.src = this.image;
				return this.infoData;
			},
			formatNumber(n) {
				// 把身份证上日期转为时间戳
				let nDate = n.split("");
				let x = nDate.slice(0, 4).join("");
				let y = nDate.slice(4, 6).join("");
				let z = nDate.slice(6, 8).join("");
				return x + "-" + y + "-" + z;
			},
			// 离开该组件清除定时器
			beforeDestroy() {
				window.clearInterval(this.idTimer);
				this.idTimer = null;
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
</style>
