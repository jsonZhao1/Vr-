<template>
	<div class="lead-bg">
		<div class="leader-top">
			<div class="leader-top-title">
				<h2>培训档案</h2>
				<span>Training records</span>
			</div>
			<img src="../../assets/images/btn_back@2x.png" alt @click="ToBackView" />
		</div>
		<div class="slide-box boxItem">
			<div class="boxItem_serch">
				<el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="demo-ruleForm" :inline="true">
					<el-form-item prop="userName" label="姓名:">
						<el-input v-model="ruleForm.userName" placeholder="请输入姓名"></el-input>
					</el-form-item>
					<el-form-item prop="result" label="考核结果">
						<el-select v-model="ruleForm.result" placeholder="请选择考核结果">
							<el-option label="通过" value="通过"></el-option>
							<el-option label="不通过" value="不通过"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="VRType" label="VR类别">
						<el-select v-model="ruleForm.VRType" placeholder="请选择VR类别">
							<el-option v-for="item in VRTypes" :key="item._id" :label="item.name" :value="item._id"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item prop="VRProject" label="VR项目">
						<el-select v-model="ruleForm.VRProject" placeholder="请选择VR项目">
							<el-option v-for="item in VRProjects" :key="item._id" :label="item.name" :value="item._id" ></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="培训时间">
						<el-col :span="12">
							<el-form-item prop="date1">
								<el-date-picker type="date" placeholder="请选择起始日期" v-model="ruleForm.date1" format="yyyy 年 MM 月 dd 日"
								 value-format="yyyy-MM-dd" :picker-options="sDateDisabled"></el-date-picker>
							</el-form-item>
						</el-col>
						<el-col class="line" :span="2">至 </el-col>
						<el-col :span="10">
							<el-form-item prop="date2">
								<el-date-picker type="date" placeholder="请选择结束日期" v-model="ruleForm.date2" format="yyyy 年 MM 月 dd 日"
								 value-format="yyyy-MM-dd" :picker-options="eDateDisabled"></el-date-picker>
							</el-form-item>
						</el-col>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="submitForm('ruleForm')" style="margin-left: 50px !important;">查询</el-button>
						<el-button class="resetForm" @click="resetForm('ruleForm')">重置</el-button>
					</el-form-item>

				</el-form>
			</div>
			<div class="boxItem_Table">
				<div class="boxItem_Table_left">
					<el-table :data="tableData" style="width: 100%;" :header-cell-style="{backgroundColor:'#D5F2FE !important',color:'#0F2732 !important',}"
					 @row-click="byOrFail">
						<el-table-column prop="userName" label="姓名"></el-table-column>
						<el-table-column prop="sex" label="性别"> </el-table-column>
						<el-table-column prop="birthday" label="生日"> </el-table-column>
						<el-table-column prop="idCardNo" label="身份证号">
						</el-table-column>
						<el-table-column prop="averageScore" label="平均得分" :formatter="formatScore"> </el-table-column>
						<el-table-column prop="workType" label="工种"></el-table-column>
						<el-table-column prop="result" label="考核结果">
							<!-- <template slot-scope="scope">
								<span @click="byOrFail(scope.row)">{{scope.row.result}}</span>
							</template> -->
						</el-table-column>
						<el-table-column label="时间" prop="startTime"></el-table-column>
					</el-table>
					<div class="pagination" style="text-align: center;margin-top:20px;">
						<el-pagination background layout="prev, pager, next" :current-page="ruleForm.pageNum" :page-size="ruleForm.pageSize"
						 :total="pageTotal" @current-change="handlePageChange" prev-text='上一页' next-text="下一页"></el-pagination>
					</div>
				</div>
				<div class="boxItem_Table_right">
					<el-table :data="projectData.projectList" style="width: 100%;" :header-cell-style="{backgroundColor:'#D5F2FE !important',color:'#0F2732 !important',}">
						<el-table-column prop="typeName" label="VR类别"></el-table-column>
						<el-table-column prop="projectName" label="VR项目"> </el-table-column>
						<el-table-column prop="errorList" label="错题/道" width="130px">
							<template slot-scope="scope">
								<span>{{scope.row.errorList.length}}</span>
								<el-button type="text" class="seeDetails" @click="seeDetails(scope.row)" v-if="scope.row.errorList.length==0?false:true">查看详情</el-button>
							</template>
						</el-table-column>
						<el-table-column prop="score" label="得分" :formatter="formatScore">

						</el-table-column>
					</el-table>
					<div class="pagination" style="text-align: center;margin-top:20px;">
						<el-pagination background layout="prev, pager, next" :current-page="projectData.pageNum" :page-size="projectData.pageSize"
						 :total="projectData.total" @current-change="handlePageChange1" prev-text='上一页' next-text="下一页"></el-pagination>
					</div>
				</div>
			</div>
			<div class="boxItem_bottom">
				<el-button class="Export" @click="handleExport">导出</el-button>
				<el-button class="print" @click="print">打印</el-button>
			</div>
		</div>

		<el-dialog title="错题" :visible.sync="dialogTableVisible" center width="500px">
			<el-table :data="errorData.errorList" :header-cell-style="{backgroundColor:'#C1E0EE !important',color:'#0F2732 !important',}"
			 center>
				<el-table-column prop="number" label="错题" width="100px"></el-table-column>
				<el-table-column prop="name" label="题目"></el-table-column>
			</el-table>
			<div class="pagination" style="text-align: center; margin-top:20px;">
				<el-pagination background layout="prev, pager, next" :current-page="errorData.pageNum" :page-size="errorData.pageSize"
				 :total="errorData.total" @current-change="handlePageChange2" prev-text='上一页' next-text="下一页"></el-pagination>
			</div>
		</el-dialog>


	</div>

</template>

<script>
    const fs = require('fs')
    const api = require('../../api/api')
    import axios from 'axios';
    import { ipcRenderer } from 'electron'
	export default {
		data() {
			return {
				tableData: [],
				VRTypes: [],
				VRProjects:[],
				projectData: {
					total: null,
					pageNum: 1,
					pageSize: 8,
					projectList: [],
					allProjectList: [] //总数 分页计算使用
				},
				errorData: {
					total: null,
					pageNum: 1,
					pageSize: 8,
					errorList: [],
					allErrorList: [] //总数 分页计算使用
				},
				ruleForm: {
					userName: '',
					result: '',
					VRType: '',
					VRProject: '',
					date1: '',
					date2: '',
					pageSize: 6,
					pageNum: 1,
				},
				pageTotal: 0,

				dialogTableVisible: false,
                filename: '',
                exportFlag: false,
				DetailsId:'',
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
                ]

			}
		},
		created() {
			this.DetailsId = this.$route.query.id || '';
			this.getDataList()
			this.VRTpeList()
			this.VRProjectList()
			
			//console.log(this.$route.query.id)
		},
        watch:{
          
        },

		methods: {
            handleExport(){
                // this.exportFile()
                this.exportFlag = false
                let downloadFile = api.default.downloadFile
                const par = {
                	param: {
                		userName: this.ruleForm.userName,
                		result: this.ruleForm.result,
                		typeId: this.ruleForm.VRType,
                		projectId: this.ruleForm.VRProject,
                		startTime: this.ruleForm.date1,
                		endTime: this.ruleForm.date2
                	}
                };
				
                this.getData('export_record',par,res=>{
                    if (res.code == 200) {
                        this.filename = res.data
                         this.exportFlag = true
                      } else {
                        this.$message({
                          type: "error",
                          message: "导出失败"
                        });
                      }
                })
                setTimeout(()=>{
                    if(this.exportFlag){
                        this.exportFile()
                    }
                },2000)
            },
            exportFile(){
                const data = fs.readFileSync(this.filename)
                console.log(data,data.length)
                let blob = new Blob([data], {
                  type: `application/msword` //word文档为msword,pdf文档为pdf
                });
                let objectUrl = URL.createObjectURL(blob);
                let link = document.createElement("a");
                let fname = `考核结果.docx`; //下载文件的名字
                link.href = objectUrl;
                link.setAttribute("download", fname);
                document.body.appendChild(link);
                    link.click();
            },
			// 打印
			print() {
				window.print();
			},
			// 点击返回上一级
			ToBackView() {
				this.$router.push({
					name: "RealName",
				});
			},
			// 重置
			resetForm(formName) {
				this.ruleForm.userName = ''
				this.ruleForm.result = ''
				this.ruleForm.VRType = ''
				this.ruleForm.VRProject = ''
				this.ruleForm.date1 = ''
				this.ruleForm.date2 = ''
				this.ruleForm.pageNum = 1
				this.ruleForm.pageSize = 7
				this.getDataList()
				this.$refs[formName].resetFields();

			},
			// 分页
			handlePageChange(val) {
				this.ruleForm.pageNum = val

				this.getDataList()

			},
			// 分页
			handlePageChange1(pageNum) {
				this.projectData.pageNum = pageNum;
				this.getListByPageNum();
			},
			// 查看详情
			seeDetails(row) {
				this.errorData.pageNum = 1;
				this.errorData.total = row.errorList.length;
				this.errorData.allErrorList = row.errorList;
				this.getErrorListByPageNum();
				this.dialogTableVisible = !this.dialogTableVisible
			},
			// 分页
			handlePageChange2(pageNum) {
				this.errorData.pageNum = pageNum;
				this.getErrorListByPageNum();
			},
			// 查询
			submitForm() {
				this.ruleForm.pageNum = 1
				this.getDataList()

			},
			getDataList() {
				const par = {
					param: {
						userName: this.ruleForm.userName,
						result: this.ruleForm.result,
						typeId: this.ruleForm.VRType,
						projectId: this.ruleForm.VRProject,
						startTime: this.ruleForm.date1,
						endTime: this.ruleForm.date2
					},
					pageNum: this.ruleForm.pageNum,
					pageSize: this.ruleForm.pageSize
				};
				if(this.DetailsId){
					par.param._id = this.DetailsId;
				}
				console.log('考核信息查询', par)
				this.getData('list_page_record', par, res => {
					console.log('培训档案', res)
					// let data = res.data 
					// let newData = data[0].projectList[0];
					
					// for(let i=0; i<10;i++){
					// 	data[0].projectList.push(newData)
					// }
					this.tableData = res.data
					this.pageTotal = res.total
                    this.projectData.projectList = []

				})
			},
			byOrFail(row) { //通过或不通过
				this.projectData.pageNum = 1;
				this.projectData.total = row.projectList.length;
				this.projectData.allProjectList = row.projectList;
				this.getListByPageNum();
			},
			getListByPageNum() { //获取分页数据 project
				const endPage = this.projectData.pageSize * this.projectData.pageNum;
				const startPage = endPage - this.projectData.pageSize;
				this.projectData.projectList = this.projectData.allProjectList.slice(startPage, endPage);
			},
			getErrorListByPageNum() { //获取分页数据 error
				const endPage = this.errorData.pageSize * this.errorData.pageNum;
				const startPage = endPage - this.errorData.pageSize;
				this.errorData.errorList = this.errorData.allErrorList.slice(startPage, endPage);
			},
			VRTpeList(){
				const data={
					type:1
				}
                console.log('查询Vr类型')
				this.getData('list_type_options',data,res=>{
					console.log(res,5555)
					this.VRTypes = res
				})
			},
			VRProjectList(){
                console.log('查询项目类型')
				const par={
					type:2
				}
				this.getData('list_project_options',par,e=>{
					console.log(e,666)
					this.VRProjects = e
				})
			},
            formatScore(row, column, cellValue, index){
                if(cellValue>0){
                    return Math.floor(cellValue)
                }else{
                    return '无'
                }
            }
		},
		computed: {
			sDateDisabled() {
				return {
					disabledDate: time => {
						return time > new Date()
					},
				};
			},
			eDateDisabled() {
				return {
					disabledDate: time => {
						if (this.ruleForm.date1) {
							return time.getTime() > new Date() || time.getTime() < new Date(this.ruleForm.date1).getTime() - 24 * 3600 *
								1000
						}


					}
				};
			},
		},
	}
</script>

<style scoped>
	.boxItem {
		width: 1300px;
		height: 780px;
		margin: 50px auto;
		border-radius: 15px;
		padding: 20px 20px;
	}

	.boxItem_serch {
		padding-top: 20px;
		background-color: #FFFFFF;
		border-radius: 10px;
		margin-bottom: 20px;

	}

	.boxItem_Table {
		width: 100%;
		height: 600px;
		background-color: #FFFFFF;
		border-radius: 20px;
	}

	/* 	.demo-ruleForm {
		width: 100%;
		display: inline-flex;
		margin-top: 25px;

	}
 */
	.el-input {
		width: 200px !important;
	}

	.boxItem_Table_left {
		width: 800px;
		float: left;
	}

	.boxItem_Table_right {
		width: 450px;
		float: right;
	}

	.seeDetails {
		width: 85px;
		height: 25px;
		line-height: 2px;
		border: 1px solid #2BBBFC !important;
		color: #2BB9FC !important;
		font-size: 12px;
	}

	.boxItem_bottom {
		margin-top: 20px;
		float: right;
	}

	.Export {
		width: 80px;
		height: 30px;
		line-height: 5px;
		background-color: #FF862C !important;
		color: #FFFFFF !important;
		border: none;
		outline: none;
	}

	.print {
		width: 80px;
		height: 30px;
		line-height: 5px;
		background-color: #2BB9FC !important;
		color: #FFFFFF !important;
		border: none;
		outline: none;
	}
</style>
