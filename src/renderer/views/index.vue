<template>
    <div style="position: relative">
        <div class="home public-bg"
             :style="{'background-image': 'url(' + bgImgUrl + ')','background-repeat':'no-repeat','background-size':'cover' }">
            <div class="public-top home-top">
                <!-- <h2>VR安全培训 让生命更安全</h2> -->
                <!--<div class="stateContent">
                    <div style="display: flex;width:300px;align-items: center;margin-right: 50px;">
                        <img :src="connectImg"/>
                        <span>{{this.connectMessage}} </span>
                    </div>
                    <div v-if="this.speedMessage != ''" style="display: flex;width:300px;align-items: center;">
                        <span class="speed">{{this.speedMessage}}</span>
                    </div>

                </div>
                <div class="state">
                </div>-->
                <div :class="['logo', logoObj.location == '上居中'?'centerLogo':'']" >
                    <el-image v-if="logoObj.iconPath"
                              style="width: 240px; height: 80px"
                            :src="'file:'+logoObj.iconPath"
                            fit="cover"></el-image>
                </div>

                <div style="display: flex; align-content: center; float: right">
                    <div class="manage" style="margin-right: 20px;">
                        <!--<el-image
                                @click="toSoftList"
                                style="width: 190px; height: 72px; cursor: pointer"
                                :src="require('../assets/images/manage.png')"
                                fit="cover"></el-image>-->
                    </div>
                    <div style="cursor: pointer;">
                        <el-image
                                @click="closeWindow"
                        		style="width: 72px; height: 72px"
                                :src="require('../assets/images/btn_close.png')"
                        		fit="cover"></el-image>
                    </div>
                </div>
            </div>
            <div class="slide-box min-height">
                <div class="buttons-box" v-if="tableData">
                    <div class="prev-btn public-btn" @click="prev" v-if="this.num != 0"></div>
                    <div class="next-btn public-btn" @click="next" v-if="this.num != Object.keys(tableData).length-1"></div>
                </div>
                <el-carousel :autoplay="false" arrow="never" indicator-position="none" ref="slideCarousel" :loop="false">
                    <el-carousel-item v-for="(classify, name) in tableData" :key="name">
                        <div class="slide-item public-slide">
                            <el-tabs :tab-position="tabPosition">
                                <el-tab-pane :label="classify.name">
                                    <div class="inside-slide">
                                        <slide-view v-if="!showColumn" :treeChild="classify.value"
                                                    @ToHomeColumn="ToHomeColumn" @execClick="execClick"></slide-view>
                                        <home-column v-else @ToSlideView="ToSlideView" :columnData="classify.value"
                                                     @execClick="execClick"></home-column>

                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="public-bom">
                <img src="../assets/images/btn_f_screen.png" alt @click="ToIndexView"/>
                <img src="../assets/images/btn_click_lead.png" alt @click="ToLeaderBoard"/>
                <img src="../assets/images/RealName.png" v-if="showTrain" alt @click="RealName">
                <img src="../assets/images/btn_system_help.png" alt @click="go('SystemHelp')">
            </div>
            <!-- 视频 -->
            <el-dialog :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false"
                       :close-on-press-escape="false"
                       :before-close="handleClose">
                <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="false"
                              :options="videoOptions"></video-player>
            </el-dialog>
            <!-- mask -->
            <div class="mask" v-if="showMask">
                <img src="../assets/images/mask_bg.gif" alt="">
            </div>
        </div>

        <seamless-scroll ref="scrollRef" v-if="noticeObj.content" :data="[noticeObj.content,noticeObj.content]" :class-option="optionLeft"
                         :class="['seamless-warp2', noticeObj.location=='顶部'?'seamless-top':'seamless-bottom']">
            <ul class="item">
                <li style="margin-right: 2px" v-for="i in 10"  v-text="noticeObj.content"></li>
            </ul>
        </seamless-scroll>

        <el-dialog title="管理" :visible.sync="pwdDialogShow" center @close="cancelPwdDialog">
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRule">
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
    import SlideView from "./components/slideView";
    import SeamlessScroll from 'vue-seamless-scroll'
    import VideoDialog from "./components/videoDialog";
    import HomeColumn from "./components/homeColumn";
    import "videojs-flash";


    const {ipcRenderer} = require("electron");
    const remote = require('electron').remote;
    const cfg = remote.getGlobal('sharedObject').cfg;

    export default {
        name: "index",
        props: {
            state: Boolean,
            videoUrl: String
        },
        components: {
            SlideView,
            HomeColumn,
            VideoDialog,
            SeamlessScroll
        },
        data() {
            return {
                optionLeft: {
                    direction: 2,
                    limitMoveNum: 1,
                    step: 0.5
                },
                pwdDialogShow: false,
                loginForm: {
                    managePwd: ''
                },
                loginFormRule:{
                    managePwd:[{required: true, message: '请输入管理密码', trigger: 'blur'}]
                },
                tabPosition: "left",
                showColumn: false,
                videoDialog: false,
                dialogVisible: false,
                showTrain: false,
                treeData: [],
                tableData: [],
                connectMessage: window.connectMessage,
                connectImg: window.connectImg,
                speedMessage: window.speedMessage,
                videoOptions: {
                    playbackRates: [1.0, 1.5, 2.0], // 播放速度
                    autoplay: false, // 如果true，浏览器准备好时开始回放
                    controls: true,
                    muted: false, // 默认情况下将会消除任何音频
                    loop: false, //循环播放
                    preload: "auto", // <video>加载元素后立即加载视频
                    language: "zh-CN",
                    aspectRatio: "16:9", //流畅模式，并计算播放器动态大小时使用该值
                    fluid: true, //按比例缩放以适应容器
                    sources: [{
                        type: "video/mp4",
                        src: ""
                    }],
                    //poster: "http://vjs.zencdn.net/v/oceans.png", // 封面地址
                    notSupportedMessage: "此视频暂无法播放，请稍后再试"
                },
                treeChild: [],
                imgUrl: '',
                bgImageArr: [],
                num: 0,
                showMask: false,
                initIndex: 0,
                mouseFlag: false,
                mouseTimer: null,
                backgroundData: [],
                logoObj:{
                    location: '',
                    iconPath: ''
                },
                noticeObj: {
                    location: '',
                    content: ''
                },
                typeOptions:[]
            };
        },
        watch: {
            videoUrl: function (val) {
                if (val !== "") {
                    this.$refs.videoPlayer.player.src(val);
                }
            },
            state: function (val) {
                if (val) {
                    this.$refs.videoPlayer.player.pause();
                }
            }
        },
        computed: {
            player() {
                return this.$refs.videoPlayer.player;
            },
            bgImgUrl() {
                if (this.imgUrl) {
                    return 'file:'+this.imgUrl
                } else {
                    return  'imgs/start--images.jpg'
                }
            }
        },
        created() {
            this.getInfo();
            //读取logo位置
            this.getData('read_logo', {}, res=>{
                if(res.data) {
                    this.logoObj = res.data;
                }
            });
            //读取Notice
            this.getData('read_banner', {}, res=>{
                if(res.data) {
                    this.noticeObj = res.data;
                }
            });

          //读取Notice
          this.getData('rns_config', {}, res=>{
            if(res.data) {
              this.showTrain = res.data;
            }
          });

        },
        methods: {
            toSoftList() {
                if (this.$refs.scrollRef) {
                    this.$refs.scrollRef._stopMove();
                }
                this.pwdDialogShow = true;
            },
            //页面跳转
            go(name) {
                this.$router.push({
                    name: name
                });
            },
            closeMask() {
                const TIME_COUNT = 5;
                if (!this.timer) {
                    this.count = TIME_COUNT;
                    this.showMask = false;
                    this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= TIME_COUNT) {
                            this.count--;
                            this.showMask = true;
                        } else {
                            this.showMask = false;
                            clearInterval(this.timer);
                            this.timer = null;
                        }
                    }, 1000)
                }
            },
            getInfo() {
                this.getData('list_classify', {}, res => {
                    this.typeOptions = res.data;
                    let tableData = {};

                    if (res.data) {
                        this.getData('list_page_program', {
                            pageNum: 1,
                            pageSize: 1000
                        }, ({data}) => {
                            if (data) {
                                data.map(item=>{
                                    if (item.isHidden ==2) {
                                        //隐藏
                                    } else {
                                        let classify = this.getClassify(item.classifyId);
                                        let classifyName = classify.classifyName;
                                        if (tableData[classifyName]) {
                                            this.pushItem(tableData[classifyName], item);
                                        }  else {
                                            //新分类
                                            tableData[classifyName] = [[item]];
                                            //this.bgImageArr.push(classify.backgroundImgUrl);
                                        }
                                    }
                                })
                                let newTableData=[];
                                for(let type in this.typeOptions ){
                                  for(let key in tableData){
                                    if(this.typeOptions[type].classifyName==key){
                                      newTableData.push({name:key,value:tableData[key]})
                                    }
                                  }
                                  this.bgImageArr.push(this.typeOptions[type].backgroundImgUrl);
                                }
                                console.log(newTableData)
                                this.tableData = newTableData;

                                if(this.bgImageArr[0]) {
                                    this.imgUrl = this.bgImageArr[0].replace(/\\/g, "/")
                                }
                            }
                        })
                    }
                })
            },
            pushItem(ary, item) {
                let lasIndex = ary.length -1;
                if(ary[lasIndex].length>= (this.showColumn?40:10)) {
                    //每页条数
                    ary.push([item]);
                }else {
                    ary[lasIndex].push(item);
                }
            },

            getClassify(classifyId) {
                let classify = {};
                this.typeOptions.map(item => {
                    if (item._id == classifyId) {
                        classify = item;
                        return;
                    }
                })
                return classify;
            },
            ToHomeColumn() {
                this.getInfo()
                this.showColumn = true;
            },
            ToLeaderBoard() {
                this.$router.push({
                    name: "leader-board"
                });
            },
            // 实名制验证
            RealName() {
                this.$router.push({
                    name: "RealName"
                });
            },
            // 返回首屏
            ToIndexView() {
                this.num = 0;
                this.imgUrl = this.bgImageArr[0].replace(/\\/g, "/");
                this.$refs.slideCarousel.activeIndex = 0;
            },
            ToSlideView() {
                this.getInfo();
                this.showColumn = false;
                // api.getNewTreeInfo().then(res => {
                //     //console.log(res)
                //     //console.log(444)
                //     if (!res || res.length == 0) {
                //         this.imgUrl = window._static + "default_bg.png";
                //     } else {
                //         this.treeData = res;
                //         for (let i = 0; i < this.treeData.length; i++) {
                //             this.treeData[i].index = i;
                //         }
                //         this.arrFun(this.treeData);
                //     }
                // });
                // this.imgUrl = this.bgImageArr[this.num].replace(/\\/g, "/");
            },
            handleClose(done) {
                this.$confirm("确认关闭？")
                    .then(function(){
                        done();
                        this.$refs.videoPlayer.player.pause();
                    })
                    .catch(function(){
                    });
            },
            execClick(par) {
              console.log('cfg.triggerModel',cfg.triggerModel)
                if (cfg.triggerModel == 1) {
                    return;
                }
                let self = this;
                ipcRenderer.send("click-count", par._id);
                ipcRenderer.send("exec", par);
                ipcRenderer.on('wait-message', function (event, message) {
                  console.log('event',event)
                  console.log('message',message)
                  self.closeMask();
                });
            },
            closeWindow() {
                this.$confirm("确认退出平台吗？")
                    .then(function(){
                        ipcRenderer.send("close");
                    })
                    .catch(function(){
                    });
            },
            prev() {
                this.num--;
                if (this.num == 0) {
                    this.num = 0;
                }
                if(this.bgImageArr[this.num]) {
                    this.imgUrl = this.bgImageArr[this.num].replace(/\\/g, "/");
                    this.$refs.slideCarousel.prev();
                }
            },
            next() {
                this.num++;
                if (this.num == this.treeData.length) {
                    this.num = this.treeData.length - 1;
                }
                if(this.bgImageArr[this.num]) {
                    this.imgUrl = this.bgImageArr[this.num].replace(/\\/g, "/");
                    this.$refs.slideCarousel.next();
                }
            },
            // mouseLeave() {
            //     if (cfg.triggerModel == 0) {
            //         return;
            //     }
            //     this.mouseFlag = false;
            //     clearInterval(this.mouseTimer);
            // },
            // mouseEnter(items) {
            //     if (cfg.triggerModel == 0) {
            //         return;
            //     }
            //     let self = this;
            //     let par = {
            //         src: items.src,
            //         id: items.id,
            //     }
            //     self.mouseFlag = true;
            //     if (self.mouseFlag) {
            //         self.mouseTimer = setTimeout(function () {
            //             if (items.type == 'vedio') {
            //                 self.dialogVisible = true;
            //                 self.videoOptions.sources[0].src = items.src;
            //                 ipcRenderer.send("click-count", items.id);
            //             } else {
            //                 ipcRenderer.send("exec", par);
            //                 ipcRenderer.on('wait-message', function (event, message) {
            //                     self.closeMask();
            //                 });
            //             }
            //         }, cfg.second)
            //     }
            // }
            //登录
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
            },
            cancelPwdDialog() {
                if (this.$refs.scrollRef) {
                    this.$refs.scrollRef._startMove();
                }
                this.pwdDialogShow = false;
                this.$refs.loginFormRef.resetFields();
            }
        }
    };
</script>

<style lang="scss">
    @import "../assets/styles/public.scss";

    .public-bg {
        width: 100%;
        background: url("../assets/images/start.jpg") no-repeat center;
        padding: 0 60px;
        height: 1080px;
    }


    .home-top h2 {
        font-size: 54px;
        color: #fff;
        font-family: SourceHanSansCN;
    }


    .home {
        position: relative;

        .el-dialog__headerbtn {
            height: 48px;
            top: 10px;
            width: 48px;
            background: url("../assets/images/icon_v_close@2x.png") no-repeat center;
            font-size: 0px;
            z-index: 9999;
        }

        .el-carousel__arrow--left {
            left: 0px;
        }

        .el-carousel__arrow--right {
            right: 0px;
        }
    }

    .inside-slide {
        .el-carousel__arrow {
            width: 29px;
            height: 60px;
            margin-top: 0px;
            background-color: transparent;
            font-size: 0px;
            border-radius: 0px;
        }

        .el-carousel__arrow--left {
            left: 20px;
            background: url("../assets/images/icon_previous_page_no.png") no-repeat center;
        }

        .el-carousel__arrow--left:hover {
            background: url("../assets/images/icon_previous_page.png") no-repeat center;
        }

        .el-carousel__arrow--right {
            right: 20px;
            background: url("../assets/images/icon_next_page_no.png") no-repeat center;
        }

        .el-carousel__arrow--right:hover {
            background: url("../assets/images/icon_next_page.png") no-repeat center;
        }
    }

    .buttons-box {
        .public-btn {
            width: 65px;
            height: 130px;
            position: absolute;
            top: 50%;
            margin-top: -65px;
            cursor: pointer;
            z-index: 9999;
        }

        .prev-btn {
            left: 0px;
            background: url("../assets/images/prev_btn.png") no-repeat center;
        }

        .next-btn {
            right: 0px;
            background: url("../assets/images/next_btn.png") no-repeat center;
        }
    }

    .mask {
        position: absolute;
        width: 100%;
        height: 1080px;
        background: rgba(0, 0, 0, .6);
        top: 0px;
        left: 0px;
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .mask img {
        display: block;
        width: 100%;
    }
    .logo{
        height: 80px;
        position: relative;
        top: 80px;
    }
    .centerLogo{
        text-align: center;
    }
    .seamless-warp2 {
        overflow: hidden;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        width: 100%;
        background: #000000;
        opacity: 0.6;
        color: #FFFFFF;
        ul.item {
            width: 100%;
            li {
                float: left;
                margin-right: 200px!important;
            }
        }
    }

    .seamless-top {
        position: absolute;
        top: 0px
    }

    .seamless-bottom{
        position: absolute;
        bottom: 0px;
    }




</style>
