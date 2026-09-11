<template>
  <div>
    <el-dialog :visible.sync="dialogVisible">
      <div slot="title" style="display: flex; justify-content: space-between;">
        <span style="font-size: 24px; font-weight: bold">分类管理</span>
        <div style="margin-right: 50px">
          <el-button type="primary" size="mini" @click="importClick">导入</el-button>
          <el-button type="primary" size="mini" @click="exportClick">导出</el-button>
          <el-button type="warning" size="mini" @click="resetClick">重置</el-button>

        </div>
      </div>
      <div class="content">
        <div :class="[item.checked?'active':'','item']" v-for="(item,index) in list" :key="item.id"
             @click="onItemClick(index,item)">
          <span>{{ item.classifyName }}</span>
          <span class="right" v-if="item.checked">
                    <span @click="upClick(item)">升序</span>
                    <el-divider direction="vertical"></el-divider>
                    <span @click="updateClick(item)">修改</span>
                    <el-divider direction="vertical"></el-divider>
                    <span @click="delClick(item)">删除</span>
                </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" style="display: flex; justify-content: space-around">
				<el-button type="primary" style="width:150px" @click="add">新增</el-button>
				<el-button type="primary" style="width:150px" @click="cancel">取消</el-button>
		</span>
    </el-dialog>
    <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" center>
      <el-form ref="formRef" :rules="formRule" :model="form" label-width="80px">
        <el-form-item label="名称" prop="classifyName">
          <el-input v-model="form.classifyName" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="背景图" prop="backgroundImgUrl">
          <div style="display: flex; justify-content: space-between">
            <el-upload
                class="upload"
                action=""
                :auto-upload="false"
                :on-change="changeHandler"
                accept="image/png, image/jpeg"
                :show-file-list="false"
            >
              <div class="inline">
                <el-input v-model="form.backgroundImgUrl" placeholder="请选择背景图" disabled></el-input>
                <el-button type="primary">选择...</el-button>
              </div>
            </el-upload>
          </div>
          <template v-if="form.backgroundImgUrl">
            <el-image
                style="width: 200px; height: 200px; margin-top: 10px"
                fit="cover"
                :src="'file:'+form.backgroundImgUrl"
                :z-index="9999"
                :preview-src-list="['file:'+form.backgroundImgUrl]">
            </el-image>
            <span style="margin-left: 10px;">点击预览大图</span>
          </template>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
				<el-button type="primary" style="width:150px" @click="saveClick">确定</el-button>
				<el-button type="primary" style="width:150px" @click="cancelFormClick">取消</el-button>
		    </span>
    </el-dialog>
  </div>
</template>

<script>
import {ipcMain} from "electron";

export default {
  name: "TypeMange",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      list: [],
      dialogTitle: '',
      addDialogVisible: false,
      form: {
        classifyName: '',
        backgroundImgUrl: ''
      },
      formRule: {
        classifyName: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
        backgroundImgUrl: [{required: true, message: '请选择背景图片', trigger: 'blur'}],
      }

    }
  },
  created() {

  },
  methods: {
    show() {
      this.dialogVisible = true
      this.loadList()
    },
    loadList() {
      this.getData('list_classify', {}, res => {
        this.list = res.data
      })
    },
    onItemClick(idx, item) {
      this.list.map((item, index) => {
        item.checked = index == idx
        this.$set(this.list, index, item)
      })
    },
    add() {
      this.dialogTitle = '新增'
      this.addDialogVisible = true
    },
    cancel() {
      this.dialogVisible = false
    },

    importClick() {
      //修改
      let self = this;
      self.getData('import_config', {}, res => {
        if (res.code == 200) {
          self.$message({
            type: "success",
            message: "导入成功,请重启应用后生效！"
          });
        } else {
          self.$message({
            type: "error",
            message: res.message
          });
        }
      })
    },
    exportClick() {
      //修改
      this.getData('export_config', {}, res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "导出成功,文件路径【" + res.data + "】"
          });
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      })

    },
    resetClick() {
      this.$confirm("此操作将永久重置数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //重置数据
        this.getData('reset_config', {}, res => {
          if (res.code == 200) {
            this.$alert('数据重置成功, 重启软件生效?', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.getData('closeApp', {}, res => {
                });
              }
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消重置",
        });
      });

    },
    //保存
    saveClick() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          delete this.form.checked
          if (this.form._id) {
            //修改
            this.getData('update_classify', this.form, res => {
              this.$message({
                type: "success",
                message: "修改成功!",
              });
              this.cancelFormClick()
            })
          } else {
            //新增
            this.getData('add_classify', this.form, res => {
              this.$message({
                type: "success",
                message: "添加成功!",
              });
              this.cancelFormClick()
            })
          }

        }
      })
    },
    //取消
    cancelFormClick() {
      this.loadList()
      this.$refs.formRef.resetFields()
      this.addDialogVisible = false
      this.$emit('cancel')
      console.info('reset form')
    },
    updateClick(item) {
      this.form = item
      this.dialogTitle = '修改'
      this.addDialogVisible = true
    },
    //删除
    delClick(item) {
      this.$confirm("此操作将永久删除此, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.getData('del_classify', {
          _id: item._id
        }, res => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.loadList()
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
    },
    //删除
    upClick(item) {
      this.getData('up_classify', item, res => {
        this.loadList()
      })
    },
    changeHandler(file, fileList) {
      this.form.backgroundImgUrl = file.raw.path
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  height: 400px;
  overflow-y: auto;

  .item {
    display: flex;
    justify-content: space-between;
    line-height: 60px;
    /*font-size: 20px;*/
    border-bottom: 1px solid #EBF6FB;
    padding: 0 20px;

    .right {
      color: #767676;
    }
  }

  .active {
    background-color: #EBF6FB;
  }
}

.inline {
  display: flex;

}

.upload {
  flex: 1;

  /deep/ .el-upload {
    width: 100%;

    /deep/ .el-button {
      margin-left: 10px;
    }
  }
}

/deep/ .el-dialog__wrapper {
  z-index: 999;
}
</style>
