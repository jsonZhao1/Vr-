<template>
    <div class="lead-bg">
        <div class="leader-top">
            <div class="leader-top-title">
                <h2>软件列表</h2>
                <span>SOFTWARE LIST</span>
            </div>
            <img src="../../assets/images/btn_back@2x.png" alt @click="ToBackView"/>
        </div>
        <div class="slide-box boxItem">
            <div style="padding: 10px; display: flex; justify-content: space-between">
                <div>
                    <el-form :inline="true" ref="searchFormRef" :model="ruleForm" class="demo-form-inline">
                        <el-form-item label="软件名称" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="分类" prop="classifyId">
                            <el-select v-model="ruleForm.classifyId" placeholder="请选择分类" clearable>
                                <el-option v-for="item in typeOptions" :key="item._id" :label="item.classifyName"
                                           :value="item._id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">查询</el-button>
                            <el-button type="primary" @click="onReset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div>
                    <el-button type="text" class="btn add-soft" @click="addSoft">添加软件</el-button>
                    <el-button type="text" class="btn add-type" @click="typeManage">分类管理</el-button>
                </div>
            </div>
            <div class="boxItem_Table">
                <el-table :data="tableData" style="width: 100%;"
                          @selection-change="handleSelectionChange"
                          :header-cell-style="{backgroundColor:'#D5F2FE !important',color:'#0F2732 !important'}">
                    <el-table-column
                            type="selection">
                    </el-table-column>
                    <!-- <el-table-column prop="_id" label="ID"></el-table-column> -->
                    <el-table-column label="分类">
                        <template slot-scope="scope">
                            {{getClassifyName(scope.row.classifyId)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column label="启动图标">
                        <template slot-scope="scope">
                            <el-image
                                      :src="$getPath(scope.row.iconLocalPath)"
                                      :preview-src-list="['file:'+scope.row.iconLocalPath]"
                                      fit="cover"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="resourcesLocalPath" label="执行路径" width="230"></el-table-column>
                    <el-table-column label="封面图片">
                        <template slot-scope="scope">
                            <el-image style="width: 60px; height: 60px"
                                      :preview-src-list="['file:'+scope.row.coverLocalPath]"
                                      :src="$getPath(scope.row.coverLocalPath)"
                                      fit="cover"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column label="预览视频">
                        <template slot-scope="scope">
                            <i class="el-icon-video-play" style="font-size: 35px;"
                               @click="playVideo($getPath(scope.row.videoLocalPath))"></i>
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" label="文字说明" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" width="400">
                        <template slot-scope="scope">
                            <el-button type="text" class="edit" @click="editClick(scope.row)">编辑</el-button>

                            <el-button v-if="scope.row.isHidden == 1" type="text" class="delete"
                                       @click="hiddenClick(scope.row, 2)">隐藏
                            </el-button>
                            <el-button v-else type="text" class="delete" @click="hiddenClick(scope.row, 1)">显示
                            </el-button>

                            <el-button type="text" class="delete" @click="delClick(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="box-bottom">
                    <div class="bottom">
                        <div class="left">
                            <el-button size="mini" :disabled="multipleSelection.length!=1" @click="topClick">置顶
                            </el-button>
                            <el-button size="mini" :disabled="multipleSelection.length!=1" @click="ascClick">升序
                            </el-button>
                            <el-button size="mini" :disabled="multipleSelection.length!=1" @click="descClick">降序
                            </el-button>
                        </div>
                        <div class="right">
                            <el-button size="mini" :disabled="!(totalIndex>1 && ruleForm.pageNum>1)"
                                       @click="getDataList(1)">首页
                            </el-button>
                            <el-button size="mini" @click="getDataList(ruleForm.pageNum-1)"
                                       :disabled="!(totalIndex>1 && ruleForm.pageNum>1)">上一页
                            </el-button>
                            <el-button size="mini" @click="getDataList(ruleForm.pageNum+1)"
                                       :disabled="totalIndex<=ruleForm.pageNum">下一页
                            </el-button>
                            <el-button size="mini" :disabled="ruleForm.pageNum>=totalIndex"
                                       @click="getDataList(totalIndex)">尾页
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="padding-left: 20px; width: 1200px; margin: 0 auto">
            <el-button size="mini" @click="updPwdClick">后台密码修改</el-button>
            <!--<el-button size="mini" @click="updLogoClick">自定义LOGO</el-button>-->
            <el-button size="mini" @click="noticeClick">滚动通知管理</el-button>
            <el-tooltip :content="'切换实名制: ' + showRNSText" placement="top">
              <el-switch
                  v-model="showRNS"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changeRNS">
              </el-switch>
            </el-tooltip>
        </div>
        <add-dialog ref="addSoftDialogRef" :visible="false" @loadList="getDataList"></add-dialog>
        <type-manage ref="typeManageDialogRef" :visible="false" @cancel="typeManageCancel"></type-manage>
        <pwd ref="pwdDialogRef" :visible="false"></pwd>
        <logo ref="logoDialogRef" :visible="false"></logo>
        <notice ref="noticeDialogRef" :visible="false"></notice>
        <el-dialog title="视频播放" :visible.sync="videoDialogVisible" center @close="closeVideo">
            <video-player class="video-player vjs-custom-skin" ref="videoPlayerRef" :playsinline="false"
                          :options="videoOptions"></video-player>
        </el-dialog>

    </div>
</template>

<script>
  import AddDialog from './components/Add'
    import TypeManage from './components/TypeManage'
    import Pwd from './components/Pwd'
    import Logo from './components/Logo'
    import Notice from './components/Notice'
  export default {
        data() {
            return {
                loading: false,
                showViewer: false,
                previewImage: [],
                videoDialogVisible: false,
                tableData: [],
                pageTotal: 0,
                ruleForm: {
                    name: '',
                    classifyId: null,
                    pageSize: 5,
                    pageNum: 1
                },
                showRNS: false,
                showRNSText: '禁用',
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
                    notSupportedMessage: "此视频暂无法播放，请稍后再试"
                },
                table: {},
                multipleSelection: [],
                typeOptions: []
            }
        },
        computed: {
            totalIndex() {
                if (this.pageTotal % this.ruleForm.pageSize == 0) {
                    return parseInt(this.pageTotal / this.ruleForm.pageSize);
                } else {
                    return parseInt(this.pageTotal / this.ruleForm.pageSize) + 1;
                }
            }
        },
        components: {
            AddDialog, TypeManage,Pwd, Logo,Notice
        },
        created() {
            //初始化分类
            this.getData('list_classify', {}, res => {
                this.typeOptions = res.data;
                this.getDataList();
            })
        },
        methods: {
            getDataList(index) {
                if (index) {
                    this.ruleForm.pageNum = index;
                }
                this.getData('list_page_program', {
                    pageNum: this.ruleForm.pageNum,
                    pageSize: this.ruleForm.pageSize,
                    param: {
                        name: this.ruleForm.name,
                        classifyId: this.ruleForm.classifyId
                    }
                }, res => {
                  console.log(' res.data', res.data)
                    this.tableData = res.data;
                    this.pageTotal = res.total;
                })

                this.getData('rns_config', {
                }, res => {
                    this.showRNS=res.data;
                    this.showRNSText=res.data?'开启':'关闭';
                })
            },
            // 点击返回上一级
            ToBackView() {
                this.$router.go(-1);
                // this.$router.push({
                //     name: "index",
                // });
            },

            // 删除
            delClick(row) {
                this.$confirm("确认删除?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    const data = {
                        _id: row._id
                    }
                    this.getData('del_program', data, res => {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.ruleForm.pageNum = 1
                        this.getDataList()
                    })
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
            },
            // 编辑
            editClick(row) {
                this.$refs.addSoftDialogRef.show(row);
            },
            //隐藏
            hiddenClick(row, isHidden) {
                this.getData('update_program', {
                    _id: row._id,
                    isHidden: isHidden
                }, res => {
                    this.$message({
                        type: "success",
                        message: "操作成功成功!",
                    });
                    this.getDataList()
                })
            },
            //切换实名制开关
            changeRNS(value){
              this.showRNSText=value?'开启':'关闭';
              this.getData('save_rns', {
                value: value
              }, res => {
              })
            },
            // 添加软件
            addSoft() {
                this.$refs.addSoftDialogRef.show();
            },
            // 分类管理
            typeManage() {
                this.$refs.typeManageDialogRef.show();
            },
            //置顶
            topClick() {
                let row = this.multipleSelection[0];
                this.getData('top_program', row, res => {
                    this.$message({
                        type: "success",
                        message: "置顶成功!"
                    });
                    this.ruleForm.pageNum = 1;
                    this.getDataList();
                })
            },
            //升序
            ascClick() {
                let row = this.multipleSelection[0];
                this.getData('up_program', row, res => {
                    if (res == -1) {
                        this.$message({
                            type: "warn",
                            message: "升序无效，当前记录已是最上级!"
                        });
                    } else {
                        this.$message({
                            type: "success",
                            message: "升序成功!"
                        });
                        this.getDataList()
                    }
                })
            },
            //降序
            descClick() {
                let row = this.multipleSelection[0];
                this.getData('down_program', row, res => {
                    if (res == -1) {
                        this.$message({
                            type: "warn",
                            message: "降序无效，当前记录已是最下级!"
                        });
                    } else {
                        this.$message({
                            type: "success",
                            message: "降序成功!"
                        });
                        this.getDataList();
                    }
                })
            },
            //后台密码修改
            updPwdClick() {
                this.$refs.pwdDialogRef.show();
            },
            //自定义logo
            updLogoClick() {
                this.$refs.logoDialogRef.show();
            },
            //滚动条设置
            noticeClick() {
                this.$refs.noticeDialogRef.show();
            },

            // 保存
            centerDialogVisible() {
                this.dialogTableVisible = !this.dialogTableVisible;
                const body = {
                    _id: this._id,
                    phoneNumber: this.table.telphone,
                    workType: this.table.workType
                }
                this.getData('update_user_info', body, res => {
                    this.$message({
                        type: "success",
                        message: "保存成功"
                    });
                    this.ruleForm.pageNum = 1;
                    this.getDataList();

                })
            },
            //选择某一项
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            playVideo(src) {
                this.videoDialogVisible = true;
                this.videoOptions.sources[0].src = src;
            },
            closeVideo() {
                setTimeout(() => {
                    this.videoOptions.sources[0].src = '';
                }, 200);
            },

            closePreview() {
                this.showViewer = false;
            },
            onSubmit() {
                this.getDataList(1);
            },
            onReset() {
                this.$refs.searchFormRef.resetFields();
                this.onSubmit();
            },
            getClassifyName(classifyId) {
                let name = '异常';
                this.typeOptions.map(item => {
                    if (item._id == classifyId) {
                        name = item.classifyName;
                        return;
                    }
                })
                return name;
            },
            //分类管理窗口关闭，查询typeOptions刷新
            typeManageCancel() {
                this.getData('list_classify', {}, res => {
                    this.typeOptions = res.data;
                })
            }
        },
    };
</script>

<style scoped lang="scss">
    .boxItem {
        width: 1200px;
        height: 680px;
        margin: 50px auto;
        margin-bottom: 10px;
        padding: 20px 20px;
        border-radius: 20px;
        background-color: #ffffff;
    }


    .boxItem_Table {
        width: 100%;
        height: 580px;
        position: relative;
    }

    .el-input {
        width: 150px !important;
    }

    .btn {
        width: 100px;
        color: #ffffff !important;
    }

    .add-soft {
        background-color: #ff862c !important;
    }

    .add-type {
        background-color: #0F2732 !important;
    }

    .box-bottom {
        position: absolute;
        bottom: 20px;
        width: 100%;

        .bottom {
            display: flex;
            justify-content: space-between;
        }

        .right {
            display: flex;
        }
    }

    .resetForm {
        background-color: #c1e0ee !important;
        color: #0f2732 !important;
    }

    .Input {
        border: none;
        outline: none;
        color: #60676a !important;
    }

    .InputFace {
        width: 100px;
        height: 30px;
        line-height: 5px;
        border: 1px solid #2bbbfc !important;
    }

    .delete {
        width: 100px;
        height: 30px;
        line-height: 5px;
        background-color: #c1e0ee !important;
        color: #60676a !important;
    }

    .edit {
        width: 100px;
        height: 30px;
        line-height: 5px;
        background-color: #2bbdfc !important;
        color: #ffffff !important;
    }

    .centerDialogVisible {
        width: 150px;
    }

    .edit_table table {
        width: 510px;
        height: 230px;
        border: 1px solid #ecf7fb;
        line-height: 20px;
        text-indent: 10px;
        border-radius: 10px;
    }

    .telinput {
        width: 220px !important;
    }

    .workselect {
        width: 200px !important;
    }
</style>
