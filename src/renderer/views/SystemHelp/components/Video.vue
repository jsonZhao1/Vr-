<template>
	<div class="lead-bg">
		<div class="leader-top">
		  <div class="leader-top-title">
		    <h2>视频教程</h2>
		    <span>VIDEO COURSE</span>
		  </div>
		  <img src="../../../assets/images/btn_back@2x.png" alt @click="ToBackView" />
		</div>
		<div class="slide-box boxItem">
			<video-player class="video-player vjs-custom-skin" ref="videoPlayerRef" :playsinline="false" :options="videoOptions"></video-player>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				videoOptions: {
					playbackRates: [1.0, 1.5, 2.0], // 播放速度
					autoplay: false, // 如果true，浏览器准备好时开始回放
					controls: true,
					muted: false, // 默认情况下将会消除任何音频
					loop: false, //循环播放
					// preload: "auto", // <video>加载元素后立即加载视频
					language: "zh-CN",
					// aspectRatio: "16:9", //流畅模式，并计算播放器动态大小时使用该值
					fluid: true, //按比例缩放以适应容器
					sources: [{
						type: "video/mp4",
						src: ""
					}],
					//poster: "http://vjs.zencdn.net/v/oceans.png", // 封面地址
					notSupportedMessage: "此视频暂无法播放，请稍后再试"
				},
			}
		},
		created() {
			this.getData('help_config', {}, res => {
				console.info('res='+res)
				if(res.data && res.data.videoPath) {
					this.$set(this.videoOptions.sources[0], 'src', res.data.videoPath)
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
