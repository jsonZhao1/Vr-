<template>
    <el-dialog title="定制LOGO" :visible.sync="dialogVisible" @close="cancelFormClick">
        <div class="content">
            <el-form ref="formRef" :rules="formRule" :model="form" label-width="120px">
                <el-form-item label="LOGO位置:" prop="location">
                    <el-radio-group v-model="form.location">
                        <el-radio border label="左上角"></el-radio>
                        <el-radio border label="上居中"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="LOGO:" prop="iconPath">
                    <div style="display: flex;">
                        <el-image
                                ref="logoImgRef"
                                :src="'file:'+form.iconPath"
                                :z-index="9999"
                                :preview-src-list="['file:'+form.iconPath]"
                                style="width: 160px; height: 90px;"></el-image>
                        <div class="right"
                             style="display: flex; flex-direction: column; justify-content: space-between">
                            <el-upload
                                    class="upload"
                                    action=""
                                    :auto-upload="false"
                                    accept="image/png, image/jpeg"
                                    :on-change="changeHandler"
                                    :show-file-list="false"
                            >
                                <div class="inline">
                                    <el-button icon="el-icon-camera-solid">上传</el-button>
                                </div>
                            </el-upload>
                            <el-button icon="el-icon-video-play" @click="previewHandler">预览</el-button>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <span slot="footer" class="dialog-footer">
				<el-button style="width: 150px" type="primary" @click="saveClick">确定</el-button>
		    </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "Logo",
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                dialogVisible: this.visible,
                form: {
                    location: '',
                    iconPath: ''
                },
                formRule: {
                    location: [{required: true, message: '请选择LOGO位置', trigger: 'blur'}],
                    iconPath: [{required: true, message: '请选择LOGO图片', trigger: 'blur'}]
                }
            }
        },
        methods: {
            show() {
                //读取logo位置
                this.getData('read_logo', {}, res => {
                    if (res.data) {
                        this.form = res.data;
                    }
                    this.dialogVisible = true;
                });
            },

            saveClick() {
                this.$refs.formRef.validate((valid) => {
                    if (valid) {
                        this.getData('save_logo', this.form, res => {
                            this.$message({
                                type: "success",
                                message: '保存成功'
                            });
                           this.cancelFormClick()
                        })
                    }
                })

            },
            cancelFormClick() {
                this.dialogVisible = false;
                this.$refs.formRef.resetFields();
                this.form = {};
            },
            changeHandler(file, fileList) {
                this.form.iconPath = file.raw.path;
            },
            previewHandler() {
                this.$refs.logoImgRef.clickHandler()
            }
        }
    }
</script>

<style scoped lang="scss">
    .right {
        margin-left: 10px;

        /deep/ .el-button {
            margin: 0px;
        }
    }

    /*/deep/.el-form-item {*/
    /*    display: flex;*/
    /*    justify-content: center;*/
    /*    /deep/.el-form-item__content{*/
    /*        margin-left: 20px!important;*/
    /*    }*/
    /*}*/

</style>
