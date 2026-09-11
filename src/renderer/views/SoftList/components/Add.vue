<template>
    <el-dialog :title="this.form._id?'修改软件':'添加软件'" :visible.sync="dialogVisible" center @close="cancel">
        <el-form ref="formRef" :rules="formRule" :model="form" label-width="80px">
            <el-form-item label="名称" prop="name">
                <el-input  v-model="form.name" placeholder="请输入产品名称"></el-input>
            </el-form-item>

            <el-form-item label="选择分类" prop="classifyId">
                <el-select v-model="form.classifyId" placeholder="请选择分类" style="width: 100%">
                    <el-option v-for="item in typeOptions" :label="item.classifyName" :value="item._id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图标" prop="iconLocalPath">
                <el-upload
                        class="upload"
                        action=""
                        :auto-upload="false"
                        accept="image/png, image/jpeg"
                        :on-change="iconChangeHandler"
                        :show-file-list="false">
                    <div class="inline">
                        <el-input v-model="form.iconLocalPath" placeholder="请选择图标" disabled></el-input>
                        <el-button type="primary">选择...</el-button>
                    </div>
                </el-upload>
				<template v-if="form.iconLocalPath">
				    <el-image
				            style="width: 200px; height: 200px; margin-top: 10px"
				            fit="cover"
				            :src="'file:'+form.iconLocalPath"
				            :z-index="9999"
                            accept="image/png, image/jpeg"
				            :preview-src-list="['file:'+form.iconLocalPath]">
				    </el-image>
				    <span style="margin-left: 10px;">点击预览大图</span>
				</template>
            </el-form-item>
            <el-form-item label="运行文件" prop="resourcesLocalPath">
                <el-upload
                        class="upload"
                        action=""
                        :auto-upload="false"
                        :on-change="resourcesChangeHandler"
                        accept=".exe"
                        :show-file-list="false">
                    <div class="inline">
                        <el-input  v-model="form.resourcesLocalPath" placeholder="请选择执行文件" disabled></el-input>
                        <el-button type="primary">选择...</el-button>
                    </div>
                </el-upload>
            </el-form-item>
            <el-form-item label="视频" prop="videoLocalPath">
                <el-upload
                        class="upload"
                        action=""
                        :auto-upload="false"
                        :on-change="videoChangeHandler"
                        accept=".mp4, .avi"
                        :show-file-list="false">
                    <div class="inline">
                        <el-input  v-model="form.videoLocalPath" placeholder="请选择视频" disabled></el-input>
                        <el-button type="primary">选择...</el-button>
                    </div>
                </el-upload>
            </el-form-item>
            <el-form-item label="介绍封面" prop="coverLocalPath">
                <el-upload
                        class="upload"
                        action=""
                        :auto-upload="false"
                        accept="image/png, image/jpeg"
                        :on-change="coverChangeHandler"
                        :show-file-list="false">
                    <div class="inline">
                        <el-input  v-model="form.coverLocalPath" placeholder="请选择图片" disabled></el-input>
                        <el-button type="primary">选择...</el-button>
                    </div>
                </el-upload>
				<template v-if="form.coverLocalPath">
				    <el-image
				            style="width: 200px; height: 200px; margin-top: 10px"
				            fit="cover"
				            :src="'file:'+form.coverLocalPath"
				            :z-index="9999"
				            :preview-src-list="['file:'+form.coverLocalPath]">
				    </el-image>
				    <span style="margin-left: 10px;">点击预览大图</span>
				</template>
            </el-form-item>
            <el-form-item label="文字介绍" prop="content">
                <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请在此输入介绍文字"
                        v-model="form.content">
                </el-input>
            </el-form-item>
            <el-form-item label="是否考核" prop="examFlag">
                <el-radio v-model="form.examFlag" label="1">是</el-radio>
                <el-radio v-model="form.examFlag" label="2">否</el-radio>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
				<template v-if="this.form._id">
					<el-button type="primary"  @click="save(true)">保存</el-button>
				</template>
				<template v-else>
					<el-button type="primary"  @click="save(false)">保存继续添加</el-button>
					<el-button type="primary"  @click="save(true)">保存并关闭</el-button>
				</template>
				<el-button type="primary"  @click="cancel">取消</el-button>
			</span>
    </el-dialog>
</template>

<script>
    export default {
        name: "Add",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                dialogVisible: this.visible,
                typeOptions:['战争'],
                form:{
					name: '',
					classifyId: undefined,
					iconLocalPath: '',
					resourcesLocalPath: '',
					videoLocalPath: '',
					coverLocalPath: '',
					content: '',
					examFlag: undefined,
				},
				formRule: {
					 name: [{required: true, message: '请输入软件名称', trigger: 'blur'}],
					 classifyId: [{required: true, message: '请选择分类', trigger: 'blur'}],
					 iconLocalPath: [{required: true, message: '请选择图标', trigger: 'blur'}],
					 resourcesLocalPath: [{required: true, message: '请选择执行文件', trigger: 'blur'}],
					 // videoLocalPath: [{required: true, message: '请选择视频', trigger: 'blur'}],
					 // coverLocalPath: [{required: true, message: '请选择封面图', trigger: 'blur'}],
					 // content: [{required: true, message: '请填写文字介绍', trigger: 'blur'}],
					 examFlag: [{required: true, message: '请选择是否考核', trigger: 'blur'}],
				}
            }
        },
        created() {

        },
        methods: {
            show(row) {
                //选择分类
				this.getData('list_classify',{}, res => {
					this.typeOptions = res.data
					if(row) {
						//修改
						this.form = JSON.parse(JSON.stringify(row))
					} else {
						this.form  = {
							name: '',
							classifyId: undefined,
							iconLocalPath: '',
							resourcesLocalPath: '',
							videoLocalPath: '',
							coverLocalPath: '',
							content: '',
							examFlag: '2',
						}
					}
					this.dialogVisible = true
				})
            },
            save(closeFlag) {
				console.log(closeFlag);
				this.$refs.formRef.validate((valid) => {
				    if (valid) {
				        // if(!this.form.videoLocalPath && !this.form.coverLocalPath) {
                        //     this.$message({
                        //         type: "error",
                        //         message: "视频或者封面必须上传一个!",
                        //     });
				        //     return
                        // }
				        if (this.form._id) {
				            //修改
				            this.getData('update_program', this.form, res => {
				                this.$message({
				                    type: "success",
				                    message: "修改成功!",
				                });
								this.afterSave(closeFlag)
				            })
				        }  else {
				            //新增
				            this.getData('add_program', this.form, res => {
				                this.$message({
				                    type: "success",
				                    message: "添加成功!",
				                });
								this.afterSave(closeFlag)
				            })
				        }

				    }
				})
            },
			afterSave(closeFlag) {
				this.$refs.formRef.resetFields()
                this.form = {
                    name: '',
                    classifyId: undefined,
                    iconLocalPath: '',
                    resourcesLocalPath: '',
                    videoLocalPath: '',
                    coverLocalPath: '',
                    content: '',
                    examFlag: '2',
                }
				this.$emit('loadList')
				if(closeFlag) {
					this.dialogVisible = false
				}
			},
            cancel() {
				this.$refs.formRef.resetFields()
                this.form = {
                    name: '',
                    classifyId: undefined,
                    iconLocalPath: '',
                    resourcesLocalPath: '',
                    videoLocalPath: '',
                    coverLocalPath: '',
                    content: '',
                    examFlag: '2',
                }
				this.dialogVisible = false
            },
			iconChangeHandler(file) {
				this.form.iconLocalPath = file.raw.path
			},
			resourcesChangeHandler(file) {
				this.form.resourcesLocalPath = file.raw.path
			},
			videoChangeHandler(file) {
				this.form.videoLocalPath = file.raw.path
			},
			coverChangeHandler(file) {
				this.form.coverLocalPath = file.raw.path
			}
        }
    }
</script>

<style scoped lang="scss">
    .inline {
        display: flex;

    }

    .upload > /deep/.el-upload{
        width: 100%;
        /deep/.el-button {
            margin-left: 10px;
        }
    }
</style>
