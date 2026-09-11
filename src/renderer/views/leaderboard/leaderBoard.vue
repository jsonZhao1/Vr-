<template>
    <div class="lead-bg">
        <div class="leader-top">
            <div class="leader-top-title">
                <h2>点击排行榜</h2>
                <span>Vr software management</span>
            </div>
            <img src="../../assets/images/btn_back@2x.png" alt @click="ToBackView"/>
        </div>
        <div class="leader-slide public-slide min-height">
            <el-carousel indicator-position="outside" arrow="always" trigger="click" :autoplay="false">
                <el-carousel-item v-for="(item, index) in rankSum" :key="index">
                    <div class="slide-table">
                        <el-table :data="tableData.slice(index*5,(index+1)*5)" style="width: 100%">
                            <el-table-column prop="name" label="体验项" width="520"></el-table-column>
                            <el-table-column prop="click" label="点击次数" width="520"></el-table-column>
                            <el-table-column label="点击排行" width="520">
                                <template slot-scope="scope">{{scope.row.index + 1}}</template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="public-bom">
            <img src="../../assets/images/btn_f_screen.png" alt @click="ToIndexView"/>
            <img src="../../assets/images/btn_system_help.png" alt @click="go('SystemHelp')">
        </div>
    </div>
</template>

<script>
    import api from "../../api/api";
    const remote = require('electron').remote;
    const  showTrain  = remote.getGlobal('equipment').showTrain;
    export default {
        name: "leader-board",
        data() {
            return {
                tableData: [],
                rankSum: "",
                showTrain: showTrain
            };
        },
        created() {
            this.loanBank();
        },
        methods: {
            loanBank() {
                let that = this;
                api.checkEquipmentData().then(res => {
                    if (res.data) {
                        if (res.data.showTrain == 1) {
                            // that.showTrain = true;
                        }
                    }
                });

                api.getRank().then(res => {
                    this.tableData = res;
                    this.rankSum = Math.ceil(res.length / 5);
                    for (let i = 0; i < this.tableData.length; i++) {
                        this.tableData[i].index = i;
                    }
                });
            },
            ToBackView() {
                this.$router.go(-1);
            },
            // 首页
            ToIndexView() {
                this.$router.push({
                    name: "index",
                    params: {
                        flag: false
                    }
                });
            },
            // 点击排行榜
            ToLeaderBoard() {
                this.$router.push({
                    name: "leader-board"
                });
            },
            RealName() {
                this.$router.push({
                    name: "RealName"
                });
            },
            //页面跳转
            go(name) {
                this.$router.push({
                    name: name
                });
            },
        }
    };
</script>

<style lang="scss">
    .lead-bg {
        width: 100%;
        background: url("../../assets/images/index_bg.png") no-repeat center;
        padding: 0 60px;
        height: 1080px;
        position: relative;
    }

    .leader-top {
        border-bottom: 1px solid rgba(255, 255, 255, 0.4);
        padding: 0 22px;
        height: 175px;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .leader-top-title {
        display: flex;
        height: 175px;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        h2 {
            font-size: 42px;
            font-weight: bold;
            color: #fff;
            margin-bottom: 15px;
        }

        span {
            font-size: 14px;
            color: #fff;
            text-transform: uppercase;
        }
    }

    .leader-top img {
        width: 72px;
        height: 72px;
        cursor: pointer;
    }

    .leader-slide {
        margin-top: 60px;

        .el-carousel__container {
            height: 640px !important;
            width: 1762px;
        }

        .el-carousel__item {
            width: 1560px;
            height: 604px;
            border-radius: 30px;
            background: #fff;
            margin-left: 101px;
        }

        .el-carousel__arrow {
            width: 29px;
            height: 60px;
            border-radius: 0px;
            margin-top: -30px;
            background-color: transparent;
        }

        .el-icon-arrow-left {
            display: none;
        }

        .el-icon-arrow-right {
            display: none;
        }

        .el-carousel__arrow:hover {
            background-color: transparent;
        }

        .el-carousel__arrow--left {
            background-image: url("../../assets/images/icon_previous_page_no.png");
        }

        .el-carousel__arrow--left:hover {
            background-image: url("../../assets/images/icon_previous_page.png");
        }

        .el-carousel__arrow--right {
            background-image: url("../../assets/images/icon_next_page_no.png");
        }

        .el-carousel__arrow--right:hover {
            background-image: url("../../assets/images/icon_next_page.png");
        }

        .el-table td,
        .el-table th {
            padding: 0px;
            height: 100px;
            text-align: center;
            font-size: 30px;
            color: #0f2732;
        }

        .el-table .cell {
            line-height: 100px;
        }

        .el-table th > .cell {
            background: rgba(43, 188, 252, 0.2);
        }

        .el-table td,
        .el-table th.is-leaf {
            border-bottom-color: #d5f2fe;
        }

        .el-table__body .el-table__row td:nth-child(3) {
            color: #ff8329;
        }
    }

    .slide-table {
        width: 100%;
        border-radius: 30px;
    }

    .leader-slide .el-table {
        height: 604px;
        border-radius: 30px;
    }
</style>
