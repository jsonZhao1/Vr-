<template>
    <div>
        <el-carousel
                ref="slideCarousel"
                indicator-position="none"
                arrow="always"
                trigger="click"
                :loop="false"
                :autoplay="false"
        >
            <el-carousel-item v-for="(item, index) in treeChild" :key="index">
                <div class="slide-main">
                    <div class="banner-top">
                        <img src="../../assets/images/btn_list.png" alt @click="ToHomeColumn"/>
                    </div>
                    <div class="public-info">
                        <div
                                class="public-items"
                                style="width: auto"
                        >
                            <div class="list-box">
                                <div class="item-list"  v-for="(treeItem, treeIndex) in item" :key="treeIndex">
                                    <div @dblclick="execClick(treeItem)"
                                         @mouseenter="enter(treeItem, treeIndex,$event)"
                                         ref="itemRef"
                                         @mouseleave="leave(treeItem)" class="item-list-box">
                                        <div style="text-align: center;color: white;font-weight: bold;">
                                            <img :src="'file:'+treeItem.iconLocalPath" alt style="width: 170px; height: 170px; object-fit: cover;"/>
                                            <span style="position: relative;top: -32px;">{{treeItem.name}}</span>
                                        </div>
                                        <div v-if="treeItem.examFlag == 1" class="kaohe-img">
                                            <img  src="../../assets/images/label_kaohe.png" alt/>
                                        </div>
                                    </div>
                                    <!-- 鼠标移入效果 -->
                                    <div :class="{'item-child':true,'itemAct':itemActFlag}" :style="{right:rightNum}"
                                         v-show="seen && treeIndex==current">
                                        <div class="item-child-main">
                                            <template v-if="treeItem.videoLocalPath || treeItem.coverLocalPath">
                                                <img v-if="!treeItem.videoLocalPath" :src="'file:'+treeItem.coverLocalPath" alt="">
                                                <div v-else class="video-main">
                                                    <video width="100%"
                                                           :id="treeItem._id"
                                                           :src="'file:'+treeItem.videoLocalPath"
                                                           type="video/mp4"
                                                           controls="controls">
                                                    </video>
                                                </div>
                                            </template>
                                            <div class="item-child-txt">
                                                <h2>{{treeItem.name}}</h2>
                                            </div>
                                            <div class="item-child-info">
                                                {{treeItem.content}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    export default {
        props: {
            treeChild: {
                type: Array,
                default: []

            },
        },
        name: "slide-view",
        data() {
            return {
                // activeWidth:
                tableData: [],
                seen: false,
                current: 0,
                curIndex: 0,
                newArr: [],
                rightNum: null,
                itemActFlag: false,
                // itemWidth: ''
            };
        },
        created() {

            console.log(this.treeChild, "wang");

        },
        methods: {
            ToHomeColumn() {
                this.$emit("ToHomeColumn");
            },
            execClick(item) {
                let par = {
                    src: item.resourcesLocalPath,
                    _id: item._id
                }
                this.$emit("execClick", par);
            },
            leave(item) {
                // this.$emit("mouseLeave");
                this.seen = false;
                this.current = null;
                this.curIndex = null;
                let video = document.getElementById(item._id);
                if (item.videoLocalPath) {
                    video.pause();
                }

            },
            enter(item, index, event) {
                // if (item.videoLocalPath || item.coverLocalPath) {
                    console.log(item);

                    if(!item.videoLocalPath && !item.coverLocalPath && !item.content) {
                        return
                    }

                    if (event.pageX > 1200) {
                        this.rightNum = 250 + 'px';
                        this.itemActFlag = true;
                    } else {
                        this.rightNum = null;
                        this.itemActFlag = false;
                    }
                    let video = document.getElementById(item._id);
                    this.curIndex = index;
                    this.seen = true;
                    this.current = index;
                    if (item.videoLocalPath) {
                        video.play();
                    }
                // }else{
                    this.seen = true;
                // }

                // this.$emit("mouseEnter", items);
            }
        }
    };
</script>

<style lang="scss">
    .slide-main {
        overflow: hidden;
        width: 1430px;
        padding-left: 80px;
    }

    .banner-top {
        display: flex;
        justify-content: flex-end;
        flex-direction: row;
        cursor: pointer;
    }

    .banner-top img {
        height: 72px;
        width: 72px;
    }

    .public-info {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .public-items {
        position: relative;
        flex-direction: column;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-right: 30px;
    }

    .public-items::after {
        height: 500px;
        width: 1px;
        display: block;
        content: "";
        position: absolute;
        right: 0px;
        top: 0px;
        background: rgba(255, 255, 255, 0.1);
    }

    .public-items:last-child::after {
        background: transparent;
    }

    .last-items {
        width: auto;
        margin-right: 0px;
    }

    .last-items::after {
        background: transparent;
    }

    .public-items h5 {
        font-size: 26px;
        color: #fff;
        margin-bottom: 30px;
        width: 100%;
    }

    .list-box {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        height: 460px;
    }

    .item-list {
        width: 220px;
        height: 200px;
        border-radius: 10px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 30px;
        margin-right: 30px;
        cursor: pointer;
        // -webkit-transition: all .2s linear;
        // transition: all .2s linear;
    }

    .item-list img {
        display: block;
        width: 100%;
        z-index: -1;
    }

    .item-list-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .item-list p {
        color: #fff;
        font-size: 18px;
    }

    // .item-list:hover{
    //   transform: translate3d(0, -2px, 0);
    //   -webkit-transform: translate3d(0, -2px, 0);
    //   box-shadow: 0px 30px 50px rgba(0, 0, 0, 0.2);
    // }
    .kaohe {
        position: absolute;
        width: 84px;
        height: 84px;
        right: 0px;
        top: 0px;
    }

    .kaohe img {
        border: none;
        border-radius: 0;
    }

    .bofang-icon {
        width: 63px;
        height: 63px;
        position: absolute;
        top: 50%;
        margin-top: -31px;
        margin-left: -31px;
        left: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .item-child {
        position: absolute;
        right: -370px;
        top: -60px;
        width: 370px;
        z-index: 99999;
        padding-left: 18px;
    }

    .video-main {
        width: 100%;
        overflow: hidden;
        border-radius: 10px;
    }

    // .video-main video{
    //   width: 100%;
    // }
    .item-list:nth-child(2n) .item-child {
        top: auto;
        bottom: 0px;
    }

    .itemAct.item-child::after {
        left: auto;
        right: -36px;
        transform: rotate(180deg);
    }

    .item-child::after {
        position: absolute;
        display: block;
        content: "";
        border-width: 18px;
        border-style: solid;
        border-color: transparent #fff transparent transparent;
        left: -18px;
        top: 50%;
        margin-top: -9px;
    }

    .item-child-main {
        padding: 8px;
        border-radius: 15px;
        background: #fff;
        overflow: hidden;
        widows: 100%;
    }

    .item-child-main > img {
        width: 100%;
        display: block;
        border-radius: 10px;
    }

    // .item-list-box:hover .item-child{
    //   opacity: 1;
    // }
    .item-child-txt {
        padding-top: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #dcdcdc;
    }

    .item-child-txt h2 {
        font-size: 20px;
        color: #333;
        line-height: 24px;
        margin-bottom: 6px;
    }

    .item-child-txt span {
        font-size: 18px;
        line-height: 20px;
        color: aqua;
        display: block;
    }

    .item-child-info {
        padding-top: 18px;
        padding-bottom: 24px;
        color: #666;
        font-size: 16px;
        line-height: 20px;
        min-height: 100px;
    }
    .kaohe-img{
        position: absolute!important;
        width: 60px!important;
        right: 5px;
        top: 3px;
    }
</style>
