<template>
    <div class="home-main">
        <div class="title">
            探索未知
        </div>
        <div class="bottom">
            分享知识，记录思考，与世界对话
        </div>
    </div> 
</template>
<script></script>
<style scoped>
    .home-main{
        position:absolute;
        width:100%;
        height:95%;
        /* background-color: aquamarine; */
        background-image: url(./background.jpg);
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
    .title{
        position:absolute;
        /* background-color: rgba(221, 223, 223, 0.3); */
        left:40%;
        width:24%;
        top:26%;
        height:9%;
        display: flex;
        justify-content: center;
        align-items: center;

        font-size:45px;
        font-family: "宋体", "PingFang SC", "Hiragino Sans GB", sans-serif;
        text-shadow:2px,2px;
    }
    .bottom{
        position:absolute;
        background-color: rgb(239, 243, 243,0.3);
        bottom: 1%;
        width:1%;
        left:40%;
        width:24%;
        display: flex;
        justify-content: center;
        align-items: center;

        font-family: "宋体", "PingFang SC", "Hiragino Sans GB", sans-serif;
    }
</style>
