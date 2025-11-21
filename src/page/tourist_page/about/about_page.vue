<template>
    <div class="about-page-container">
        <div class="about-card">
            <div class="head-port">
                <img src="https://xuebucket1.oss-cn-beijing.aliyuncs.com/cf11895a-158b-4643-97a7-acb30d471314.png" alt="头像" style=" position: absolute; top: 13%; height:70%;width:100%;margin:0;padding: 0;border-radius: 50%;">
            </div>
            <div class="detail">
                <div class="about-me">
                    <h1 style="position: absolute; font-size: 40px; left: 5%;">
                        关于我
                    </h1>
                    <div style="position: absolute; top: 15%; font-size: 20px; left: 5%; display: flex;
                        flex-wrap: wrap;">
                        你好！我是一名乐于分享的创作者，致力于捕获每一瞬间的灵感</div>
                    <h1 style="position: absolute; top:45%; font-size: 40px; left: 5%;">找到我</h1>
                    <div style="position: absolute; top:60%; font-size: 20px; left: 5%;">
                        <el-icon><Message /></el-icon>邮箱：2837634985@qq.com<br/>
                        <br/>
                        <el-icon><ChatDotRound /></el-icon>微信：lx13235106659<br/>
                        <br/>
                        <el-icon><Phone /></el-icon>手机号：13235106659
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script></script>
<style scoped>
.about-page-container{
    /* background-color: aquamarine; */
    width: 100%;
    height: 95%;
    background-image: url('./about.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}
.about-card{
    position: absolute;
    top: 10%;
    left: 10%;
    width: 78%;
    height: 80%;
    background: rgba(255, 255, 255, 0.4); /* 您选定的颜色 */
    backdrop-filter: blur(10px); /* 核心：背景模糊 */
    -webkit-backdrop-filter: blur(10px); /* 兼容Safari */
    border-radius: 12px; /* 圆角能增强玻璃质感 */
    border: 1px solid rgba(255, 255, 255, 0.3); /* 细微的白色边框增强立体感 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 轻微的阴影增加深度 */
}
.head-port{
    position: absolute;
    /* background-color: aqua; */
    width: 40%;
    height: 100%;
}
.detail{
    position: absolute;
    left: 40%;
    /* background-color: rgb(58, 157, 96); */
    width: 60%;
    height: 100%;
}
</style>