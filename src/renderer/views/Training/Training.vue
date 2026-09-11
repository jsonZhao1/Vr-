<template>
    <div class="lead-bg"
         :style="{'background-image': 'url(' + imgUrl + ')','background-repeat':'no-repeat','background-size':'cover' }">
        <div class="leader-top">
            <!-- <div class="leader-top-title">
                <h2>进入培训</h2>
                <span>Real-name training</span>
            </div> -->
            <div class="leader-top-boxtitle">
                <div>培训人：{{userInfo.name}}</div>
                <span>已考核：{{record.count}}项</span>
                <span style="margin-left: 30px;">耗时：{{record.time}}</span>
            </div>
            <img src="../../assets/images/btn_back@2x.png" alt @click="ToBackView"/>
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
        <!-- 视频 -->
        <el-dialog :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :before-close="handleClose">
          <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="false"
                        :options="videoOptions"></video-player>
        </el-dialog>
        <!-- mask -->
        <div class="mask" v-if="showMask">
          <img src="../../assets/images/mask_bg.gif" alt="">
        </div>

        <!-- 开始培训 -->
        <div class="EndTraining" v-if="StartTraining">
            <el-button @click="Start">开始培训</el-button>
        </div>
        <!-- 结束培训 -->
        <div class="EndTraining">
            <el-button @click="EndTraining" v-if="!StartTraining">结束培训</el-button>
        </div>
        <el-dialog title="培训完成" :visible.sync="dialogTableVisible" width="500px" center class="endtableBox">
            <!-- <el-table :data="gridData" border>
                <el-table-column property="date" label width="160"></el-table-column>
                <el-table-column property="name" label width="220"></el-table-column>
            </el-table> -->
            <table class="endtable">
                <colgroup>
                    <col style="background-color:#ECF7FB"/>
                </colgroup>
                <tr>
                    <td style="width: 200px;">培训项目：</td>
                    <td style="border-bottom:0.1px solid #ECF7FB;width:550px;text-align: left;">
                        {{table.projectList.length}}项
                    </td>
                </tr>
                <tr>
                    <td style="width: 200px;">耗时：</td>
                    <td style="border-bottom:0.1px solid #ECF7FB;width:550px;text-align: left;">
                        {{table.time?table.time:record.time}}
                    </td>
                </tr>
                <tr v-if="table.averageScore != -1">
                    <td style="width: 200px;">平均分数：</td>
                    <td style="border-bottom:0.1px solid #ECF7FB;width:550px;text-align: left;">
                        {{table.averageScore}}分
                    </td>
                </tr>
                <tr>
                    <td style="width: 200px;">考核结果：</td>
                    <td style="width:550px;text-align: left;">{{table.result}}</td>
                </tr>
            </table>
            <div class="gridDatabtn">
                <el-button @click="BackHome">返回首页</el-button>
                <el-button @click="Details">查看详情</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import SlideView from "../components/slideView";
    import SeamlessScroll from 'vue-seamless-scroll';
    import VideoDialog from "../components/videoDialog";
    import HomeColumn from "../components/homeColumn";
    import "videojs-flash";
    import api from "../../api/api.js";

    const {
        ipcRenderer
    } = require("electron");
    const remote = require("electron").remote;
    const cfg = remote.getGlobal("sharedObject").cfg;

    export default {
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
                imgUrl: '',
                num: 0,
                bgImageArr: [],
                table: {
                    projectName: '无',
                    time: null,
                    averageScore: 0,
                    result: '不合格',
                    projectList: []
                },
                dialogTableVisible: false,
                tabPosition: "left",
                treeData: [],
                showColumn: false,
                videoDialog: false,
                dialogVisible: false,
                StartTraining: true,
                userInfo: null,
                record: {
                    count: 0,
                    time: '00:00:00'
                },
                timer: null,
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
                showMask: false,
                DetailsId: ''
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
            console.log(global.__static);
            this.getInfo();
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            this.userInfo = userInfo;
        },
        methods: {
            // 点击返回上一级
          toSoftList() {
            if (this.$refs.scrollRef) {
              this.$refs.scrollRef._stopMove();
            }
            this.pwdDialogShow = true;
          },
            ToBackView() {
                this.$router.go(-1);
            },
            // 返回首页
            BackHome() {
                this.$router.push({
                    name: "RealName"
                });
            },
            // 开始培训
            Start() {
                console.log('开始培训')
                this.getData('start_train', {}, res => {
                    console.log(res)
                    if (res.code == 200) {
                        this.StartTraining = false
                        // 获取结果
                        let timer = setInterval(() => {
                            this.getData('get_current_record', {}, record => {
                                console.log(record,)
                                if (record.code == 200) {
                                    this.record = record.data
                                }

                            })
                        }, 1000)
                        this.timer = timer

                    } else {
                        this.$message.error(res.message)
                    }

                })
                // 离开当前组件的时候清除定时器
                this.$once("hook:beforeDestroy", () => {
                    window.clearInterval(this.timer);
                });
            },
            // 查看详情
            Details() {
                this.$router.push({
                    name: "TrainingFile",
                    query: {
                        id: this.DetailsId
                    }
                });
            },
            // 结束培训
            EndTraining() {
                const body = {}
                let self = this
                this.getData('end_train', body, res => {
                    let train = res.data
                    // 获取培训分数
                    this.getData('get_record', {
                        trainId: train._id
                    }, record => {
                        if (record) {
                            record.averageScore = Math.floor(record.averageScore)
                            this.table = record
                            self.DetailsId = record._id
                        } else {
                            self.DetailsId = -1
                        }
                        clearInterval(self.timer)
                        self.dialogTableVisible = !self.dialogTableVisible;
                    })
                })
            },
            ToHomeColumn() {
                this.showColumn = true;
                api.getNewTextTree().then(res => {
                    //console.log(res)
                    //console.log(333)
                    this.treeData = res;
                });
            },
            ToSlideView() {
                this.showColumn = false;
                api.getNewTreeInfo().then(res => {
                    //console.log(res)
                    //console.log(444)
                    if (!res || res.length == 0) {
                        this.imgUrl = window._static + "default_bg.png";
                    } else {
                        this.treeData = res;
                        for (let i = 0; i < this.treeData.length; i++) {
                            this.treeData[i].index = i;
                        }
                        this.arrFun(this.treeData);
                    }
                });
                this.imgUrl = this.bgImageArr[this.num].replace(/\\/g, "/");
            },
            execClick(par) {
                if (cfg.triggerModel == 1) {
                    return;
                }
                let self = this;
                //ipcRenderer.send("click-count", par._id);
                ipcRenderer.send("exec", par);
                ipcRenderer.on("wait-message", function (event, message) {
                    self.closeMask();
                });
            },
            handleClose(done) {
                this.$confirm("确认关闭？")
                    .then(function () {
                        done();
                        this.$refs.videoPlayer.player.pause();
                    })
                    .catch(function () {

                    });
            },
            arrFun(arr) {
                let arrImg = [];
                for (let i = 0; i < arr.length; i++) {
                    arrImg.push(arr[i].backgroundLocalPath);
                }
                this.bgImageArr = arrImg;
                this.imgUrl = this.bgImageArr[0].replace(/\\/g, "/");
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
            prev() {
                this.num--;
                if (this.num == 0) {
                    this.num = 0;
                }
                this.imgUrl = this.bgImageArr[this.num].replace(/\\/g, "/");
                this.$refs.slideCarousel.prev();
            },
            next() {
                this.num++;
                if (this.num == this.treeData.length) {
                    this.num = this.treeData.length - 1;
                }
                this.imgUrl = this.bgImageArr[this.num].replace(/\\/g, "/");
                this.$refs.slideCarousel.next();
            },

        }
    };
</script>

<style scoped>
    .lead-bg {
        width: 100%;
        background: url("../../assets/images/index_bg.png") no-repeat center;
        padding: 0 60px;
        height: 1080px;
        position: relative;
    }

    .prev-btn {
        left: 100px;
        background: url("../../assets/images/prev_btn.png") no-repeat center;

    }

    .next-btn {
        right: 0px;
        background: url("../../assets/images/next_btn.png") no-repeat center;
    }

    .leader-top {
        position: relative !important;
    }

    .leader-top-boxtitle {
        width: 420px;
        height: 70px;
        background-color: rgba(0, 0, 0, 0.16);
        padding: 10px 20px;
        color: #ffffff;
        line-height: 25px;
        position: absolute;
        right: 260px;
    }

    .leader-top img {
        position: absolute;
        right: 50px;
    }

    .EndTraining {
        float: right;
    }

    .EndTraining button {
        width: 270px;
        height: 70px;
        background-color: #ff9022 !important;
        color: #ffffff !important;
        border: none;
        outline: none;
        font-size: 24px;
        border-radius: 10px;
    }

    .el-table thead {
        display: none !important;
    }

    .el-table_1_column_1 {
        background-color: #ecf7fb !important;
        color: #60686a !important;
    }

    .completed {
        text-align: center;
        font-size: 24px;
        color: #102833;
        margin-top: -100px;
    }

    .gridDatabtn {
        margin-top: 20px;
    }

    .gridDatabtn button {
        width: 180px;
        color: #ffffff !important;
        background-color: #2bb9fc !important;
        border: none;
        outline: none;
        margin-left: 30px;
    }

    .endtable {
        line-height: 36px;
        font-size: 14px;
        text-align: left;
        text-indent: 20px;
        color: #60676A !important;
        width: 460px;
        height: 100px;
        border: 1px solid #EBF6FB;

    }

    .slide-box {
        margin-top: 60px;
    }
</style>
