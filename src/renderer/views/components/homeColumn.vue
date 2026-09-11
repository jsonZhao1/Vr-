<template>
    <div>

        <el-carousel
                ref="columnCarousel"
                indicator-position="none"
                arrow="always"
                trigger="click"
                :loop="false"
                :autoplay="false"
        >
            <el-carousel-item v-for="(item, index) in columnData" :key="index">
                <div class="banner-top">
                    <img src="../../assets/images/btn_list.png" alt @click="ToSlideView"/>
                </div>
                <div class="column-main">
                    <div v-for="(contentItem, contentIndex) in item" :key="contentIndex" class="item"
                         @dblclick="columnClick(contentItem)">
                        {{contentItem.name}}
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>


<script>

    export default {
        props: {
            columnData: {
                type: Array,
                default: []
            }
        },
        name: "home-column",
        data() {
            return {};
        },
        created() {
            // console.log(this.columnData);
        },
        methods: {
            ToSlideView() {
                this.$emit("ToSlideView");
            },
            columnClick(item) {
                console.log(item);
                let par = {
                    src: item.resourcesLocalPath,
                    _id: item._id,
                    useTime: item.useTime
                }
                this.$emit("execClick", par);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .column-main {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        height: 400px;
        color: white;
        .item {
            width: 238px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
        .item:hover{
            background-color: rgb(26,81,153);
            opacity: 0.4;
            font-size: 20px;
        }
    }


    .column-main li {
        width: 238px;
        position: relative;
        padding-left: 30px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    // .column-main li:first-child {
    //   min-width: 300px;
    //   padding-left: 78px;
    // }
    // .column-main li:last-child {
    //   width: auto;
    // }
    .column-main li::after {
        display: block;
        content: "";
        width: 1px;
        height: 500px;
        background: rgba(255, 255, 255, 0.1);
        position: absolute;
        right: 0px;
        top: 0px;
    }

    .column-main li:last-child::after {
        background: transparent;
    }

    .column-main li h2 {
        font-size: 26px;
        font-weight: bold;
        color: #fff;
        margin-bottom: 38px;
    }

    .column-main li dl dd {
        line-height: 46px;
        color: #fff;
        font-size: 18px;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
    }

    .column-main li dl dd p {
        width: 186px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }


    .column-main li dl dd .column-kaohe {
        width: 48px;
        height: 20px;
        background: url("../../assets/images/label_kaohe1.png") no-repeat right center;
    }
</style>
