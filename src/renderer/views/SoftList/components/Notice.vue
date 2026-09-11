<template>
    <el-dialog title="通知管理" :visible.sync="dialogVisible" center @close="cancelFormClick">
        <div class="content">
            <el-form ref="formRef" :rules="formRule" :model="form" label-width="120px" style="margin: 0 auto">
                <el-form-item label="通知位置:" prop="location">
                    <el-radio-group v-model="form.location">
                        <el-radio border label="顶部"></el-radio>
                        <el-radio border label="底部"></el-radio>
                        <el-radio border label="清除"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="通知内容:" prop="content">
                   <el-input v-model="form.content" type="textarea" rows="4" placeholder="请在此输入通知内容"></el-input>
                </el-form-item>
            </el-form>
        </div>

        <span slot="footer" class="dialog-footer">
				<el-button style="width: 150px" type="primary"  @click="saveClick">确定</el-button>
		    </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "Notice",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                dialogVisible: this.visible,
                form: {
                    location: '',
                    content: ''
                },
                formRule:{
                    location: [{required: true, message: '请选择通知位置', trigger: 'blur'}],
                    content: [{required: true, message: '请输入通知内容', trigger: 'blur'}],
                }

            }
        },
        methods: {
            show() {
                //读取logo位置
                this.getData('read_banner', {}, res=>{
                    if(res.data) {
                        this.form = res.data
                        console.info(res)
                    }
                })
                this.dialogVisible = true
            },

            saveClick() {
                this.$refs.formRef.validate((valid) => {
                    if (valid) {
                        console.info(this.form)
                        this.getData('save_banner', this.form, res=>{
                            this.$message({
                                type: "success",
                                message: '保存成功'
                            });
                            this.dialogVisible = false
                            this.form={}
                        })
                    }
                })

            },
            cancelFormClick() {
                this.dialogVisible = false
                this.$refs.formRef.resetFields()
            }
        }
    }
</script>

<style scoped lang="scss">
    .right{
        margin-left: 10px;
        /deep/.el-button{
            margin: 0px;
        }
    }

</style>
