<template>
	<div class="lead-bg">
		<div class="leader-top">
			<div class="leader-top-title">
				<h2>人员管理</h2>
				<span>Real-name training</span>
			</div>
			<img src="../../assets/images/btn_back@2x.png" alt @click="ToBackView" />
		</div>
		<div class="slide-box boxItem">
			<div class="boxItem_serch">
				<el-form :model="ruleForm" ref="ruleForm" label-width="50px" class="demo-ruleForm">
					<el-col :span="4">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入姓名"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="性别" prop="gender">
							<el-select v-model="ruleForm.gender" placeholder="请选择">
								<el-option label="女" value="0"></el-option>
								<el-option label="男" value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="工种" prop="work">
							<el-select v-model="ruleForm.work" placeholder="请选择">
								<el-option v-for="item in workTypes" :label="item" :value="item"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item>
							<el-button type="primary" @click="submitForm('ruleForm')">查询</el-button>
							<el-button class="resetForm" @click="resetForm('ruleForm')">重置</el-button>
						</el-form-item>
					</el-col>
					<el-form-item>
						<el-button type="text" class="Addpeople" @click="Addpeople">新增人员</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="boxItem_Table">
				<el-table :data="tableData" style="width: 100%;" :header-cell-style="{backgroundColor:'#D5F2FE !important',color:'#0F2732 !important',}">
					<el-table-column prop="name" label="姓名"></el-table-column>
					<el-table-column prop="sex" label="性别"></el-table-column>
					<el-table-column prop="idCardNo" label="身份证号">
						<!-- <template slot-scope="scope">
							<span v-if="tableData[scope.$index].shareType===0">可分润</span>
							<span v-if="tableData[scope.$index].shareType===1">不可分润</span>
            </template>-->
					</el-table-column>
					<el-table-column prop="phoneNumber" label="手机号码"></el-table-column>
					<el-table-column prop="workType" label="工种"></el-table-column>
					<!-- <el-table-column label="人脸信息" width="200">
						<template slot-scope="scope">
							<el-button type="text" class="Input" prop="">已录入</el-button>
							<el-button type="text" class="InputFace" @click="FaceRecognition(scope.$index, scope.row)">录入人脸</el-button>
						</template>
					</el-table-column> -->
					<el-table-column label="操作" width="250">
						<template slot-scope="scope">
							<el-button type="text" class="delete" @click="handleDetails(scope.$index, scope.row)">删除</el-button>
							<el-button type="text" class="edit" @click="handleModify(scope.$index, scope.row)">编辑</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination" style="text-align: center;margin-top: 20px;">
					<el-pagination background layout="prev, pager, next" :current-page="query.pageIndex" :page-size="query.pageSize"
					 :total="pageTotal" @current-change="handlePageChange" prev-text="上一页" next-text="下一页"></el-pagination>
				</div>
			</div>
		</div>
		<el-dialog title="编辑" :visible.sync="dialogTableVisible" center width="550px">
			<div class="edit_table">
				<table>
					<colgroup>
						<col style="background-color:#ECF7FB" />
					</colgroup>
					<tr>
						<td>姓名：</td>
						<td style=" border-bottom:0.1px solid #ECF7FB;">{{table.name}}</td>
					</tr>
					<tr>
						<td>性别：</td>
						<td style=" border-bottom:0.1px solid #ECF7FB;">{{table.sex}}</td>
					</tr>
					<tr>
						<td>身份证号码：</td>
						<td style="border-bottom:0.1px solid #ECF7FB ">{{table.idNumber}}</td>
					</tr>
					<tr>
						<td>手机号码：</td>
						<td style=" border-bottom:0.1px solid #ECF7FB;">
							<el-input class="telinput" v-model="table.telphone"></el-input>
						</td>
					</tr>
					<tr>
						<td>工种：</td>
						<td>
							<el-select v-model="table.workType" placeholder="请选择" style="width:220px">
								<el-option v-for="item in workTypes" :label="item" :value="item"></el-option>
							</el-select>
						</td>
					</tr>
				</table>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" class="centerDialogVisible" @click="centerDialogVisible">保存</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dialogTableVisible: false,
				editTable: [],
				tableData: [{}],
                workTypes:[
                    '架子工',
                    '爆破工',
                    '电焊工',
                    '气焊工',
                    '电工',
                    '运输车辆司机',
                    '挖掘机司机',
                    '装载机司机',
                    '推土机司机',
                    '门式起重机司机',
                    '塔式起重机司机',
                    '汽车吊操作工',
                   '履带操作工',
                    '起重工',
                    '泵车操作工',
                    '汽车电工',
                    '维护电工',
                    '电气安装工',
                    '物料提升机操作工',
                    '外用电梯司机',
                    '钢筋工',
                   '混泥土工',
                    '瓦工',
                    '泥工',
                    '抹灰工',
                    '木工',
                    '潜孔钻工',
                    '手风钻工',
                    '喷锚支护工',
                    '模板工',
                    '混泥土泵工',
                    '混泥土喷射工',
                    '拌合楼运转工',
                    '装卸工',
                    '钳工',
                    '车工',
                    '机械维修工',
                    '空压机工',
                    '支撑工',
                    '装岩工',
                    '撬挖工',
                    '打桩工',
                    '水泵工',
                    '潜水工',
                    '砌石工',
                    '普通工',
                    '油漆玻璃工',
                    '沥青工',
                    '信号工'
                ],
				query: {
					pageIndex: 1,
					pageSize: 7
					,
				},
				pageTotal: 0,
				ruleForm: {
					name: "",
					gender: "",
					work: "",
					pageSize: 7,
					pageNum: 1,
				},
				table: {
					name: '',
					sex: '',
					idNumber: '',
					telphone: '',
					workType: ''
				},
				_id: ''
			};
		},
		created() {
			this.getDataList()
		},
		methods: {
			getDataList() {
				const par = {
					param: {
						name: this.ruleForm.name,
						sex: this.ruleForm.gender,
						workType: this.ruleForm.work,
					},
					pageNum: this.ruleForm.pageNum,
					pageSize: this.ruleForm.pageSize
				};
				this.getData('list_page_user_info', par, res => {
					this.tableData = res.data
					this.pageTotal = res.total
					console.log(res)
				})
			},
			// 点击返回上一级
			ToBackView() {
				this.$router.push({
					name: "RealName",
				});
			},
			// 分页
			handlePageChange(val) {
				this.ruleForm.pageNum = val
				this.query.pageIndex = val
				console.log(this.query.pageIndex, 676767676767)
				this.getDataList()
			},
			// 删除
			handleDetails(index, row) {
				this.$confirm("此操作将永久删除此人员, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						console.log(row._id)
						const data = {
							_id: row._id
						}
						this.getData('del_user_info', data, res => {
							this.$message({
								type: "success",
								message: "删除成功!",
							});
							this.ruleForm.pageNum = 1
							this.getDataList()
							console.log(res)
						})

					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除",
						});
					});
			},
			// 编辑
			handleModify(index, row) {
				this._id = row._id
				console.log(row._id)
				const params = {
					_id: row._id
				}
				this.getData('get_user_info', params, data => {
					console.log(data)
					this.table.name = data.name
					this.table.sex = data.sex
					this.table.idNumber = data.idCardNo
					this.table.telphone = data.phoneNumber
					this.table.workType = data.workType
					this.dialogTableVisible = !this.dialogTableVisible;
				})
			},
			// 重置
			resetForm(formName) {
				this.ruleForm.name = ''
				this.ruleForm.gender = ''
				this.ruleForm.work = ''
				this.ruleForm.pageNum = 1
				this.ruleForm.pageSize = 10
				this.getDataList()
				 this.$refs[formName].resetFields();	
			},
			// 查询
			submitForm() {
				this.ruleForm.pageNum = 1
				this.getDataList()
			},
			// 新增人员
			Addpeople() {
				this.$router.push({
					name: "Addpeople",
				});
			},
			// 录入人脸
			FaceRecognition() {
				this.$router.push({
					name: "FaceRecognition",
				});
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
						message: "保存成功",
					});
					console.log(res)
					this.ruleForm.pageNum = 1
					this.getDataList()

				})

			},
		},
	};
</script>

<style scoped>
	.boxItem {
		width: 1200px;
		height: 780px;
		margin: 50px auto;
		border-radius: 15px;
		padding: 20px 20px;
	}

	.boxItem_serch {
		width: 100%;
		height: 90px;
		background-color: #ffffff;
		border-radius: 10px;
		margin-bottom: 20px;
	}

	.demo-ruleForm {
		width: 100%;
		display: inline-flex;
		margin-top: 25px;
	}

	.boxItem_Table {
		width: 100%;
		height: 645px;
		background-color: #ffffff;
		border-radius: 20px;
	}

	.el-input {
		width: 150px !important;
	}

	.Addpeople {
		width: 100px;
		background-color: #ff862c !important;
		color: #ffffff !important;
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

	/* .edit_table td{
		 border-bottom:0.1px solid #ECF7FB;
		
	} */
	.telinput {
		width: 220px !important;
	}

	.workselect {
		width: 200px !important;
	}
</style>
