<template>
    <el-dialog title="密码修改" :visible.sync="dialogVisible" center @close="cancelFormClick">
        <el-form ref="formRef" :model="form" :rules="formRule">
            <el-form-item prop="oriPwd">
                <el-input  v-model="form.oriPwd" type="password" placeholder="请输入原始密码"></el-input>
            </el-form-item>
            <el-form-item prop="newPwd">
                <el-input  v-model="form.newPwd" type="password" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item prop="repeatPwd">
                <el-input  v-model="form.repeatPwd" type="password" placeholder="请确认新密码"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
				<el-button type="primary"  @click="saveClick">确定</el-button>
				<el-button type="primary"  @click="cancelFormClick">取消</el-button>
		    </span>
    </el-dialog>
</template>

<script>

    export default {
        name: "Pwd",
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            let repeatPwdValidator = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请确认新密码'));
                } else if (value !== this.form.newPwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }
            return {
                dialogVisible: this.visible,
                form: {
                    oriPwd: '',
                    newPwd: '',
                    repeatPwd: ''
                },
                formRule:{
                    oriPwd:[{required: true, message: '请输入原始密码', trigger: 'blur'}],
                    newPwd:[{required: true, message: '请输入新密码', trigger: 'blur'}],
                    repeatPwd:[
                        {required: true, validator: repeatPwdValidator, trigger: 'blur'}
                    ]
                }
            }
        },
        created() {

        },
        methods: {
            show() {
                this.dialogVisible = true
            },

            saveClick() {
                this.$refs.formRef.validate((valid) => {
                    if (valid) {
                        //查询老密码是否正确
                        this.getData('update_password', {
                            oldPassword: this.form.oriPwd,
                            newPassword: this.form.newPwd
                        }, res=>{
                            if (res.code == 200) {
                                this.$message({
                                    type: "success",
                                    message: '修改成功'
                                });
                                this.cancelFormClick();
                            }  else {
                                this.$message({
                                    type: "error",
                                    message: res.message
                                });
                            }
                        })
                    }
                })
            },
            cancelFormClick() {
                this.$refs.formRef.resetFields();
                this.dialogVisible = false;
            }
        }
    }
</script>

