<template>
    <div class="login-page">
        <img class="login-bg" src="../../assets/images/loginbg.png" alt="">
        <img class="close-btn" src="../../assets/images/btn_close.png" alt="" @click.stop="closeWindow">
        <el-button class="start-button" type="primary" @click="enterHome">开始</el-button>
    </div>
</template>

<script>
    const {ipcRenderer} = require("electron");

    export default {
        name: "Login",
        mounted() {
            window.addEventListener('keyup', this.handleKeyup);
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.handleKeyup);
        },
        methods: {
            enterHome() {
                window.sessionStorage.setItem('loginStatus', '1');
                this.$router.replace({
                    name: 'index'
                });
            },
            handleKeyup(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    this.enterHome();
                }
            },
            closeWindow() {
                ipcRenderer.send("close");
            }
        }
    };
</script>

<style scoped>
    .login-page {
        width: 100%;
        height: 1080px;
        min-height: 100vh;
        position: relative;
        overflow: hidden;
        background: #007bd0;
    }

    .login-bg {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: fill;
    }

    .close-btn {
        width: 72px;
        height: 72px;
        position: absolute;
        top: 64px;
        right: 72px;
        z-index: 2;
        cursor: pointer;
    }

    .start-button {
        width: 220px;
        height: 68px;
        position: absolute;
        left: 50%;
        bottom: 118px;
        z-index: 2;
        transform: translateX(-50%);
        border: 1px solid rgba(255, 255, 255, .72);
        border-radius: 4px;
        background: rgba(0, 126, 214, .86);
        box-shadow: 0 10px 24px rgba(0, 44, 92, .28);
        font-size: 28px;
        font-weight: 600;
        letter-spacing: 0;
    }

    .start-button:hover,
    .start-button:focus {
        border-color: #fff;
        background: rgba(24, 167, 255, .96);
    }
</style>
