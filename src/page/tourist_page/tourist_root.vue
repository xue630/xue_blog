<template>
    <div class="container">
        <div class="header">         
                <el-menu :default-active="now_page" mode="horizontal" class="header-nav" @select="select">
                    <el-menu-item index="1">首页</el-menu-item>
                    <el-menu-item index="2">文章</el-menu-item>
                    <el-menu-item index="3">关于我</el-menu-item>
                </el-menu>
        </div>
        <!-- 主要展示区 -->
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
    <div class="bottom">
            <el-link href="https://beian.miit.gov.cn/" target="_blank" style="color: white;">苏ICP备2025220640号-1</el-link>
        </div>
</template>
<script>
    export default{
        methods:{
            select(index){
                if(index==='2'){
                    console.log('切换到文章页',index);
                    this.$router.push('/article');
                }else if(index==='3'){
                    console.log('切换到关于页',index);
                    this.$router.push('/about');
                }else{
                    console.log('切换到首页',index);
                    this.$router.push('/');
                }
            }
        },
        data(){
            return{
                now_page:'1'
            }
        },
        mounted(){
        // 获取当前路由路径
        const currentPath = this.$route.path;
        if(currentPath==="/"){
            this.now_page="1";
        }else if(currentPath==="/article"){
            this.now_page="2"
        }else{
            this.now_page="3";
        }
    }  
    }
</script>
<style scoped>
    .container{
        min-height:100vh;
        /* background-color: rgb(146, 143, 143); */
    }
    .header{
        position: sticky;
        z-index:1000;
        top:0%;
        height:10%;
        width:100%;
        /* background-color: rgb(238, 244, 239); */
    }
    .main{
        position:absolute;
        top:8%;
        width:100%;
        height:100%;
        /* background-color: aquamarine; */
    }
    .header-nav{
        /* background-color: antiquewhite; */
        width:100%;
        justify-content: center;
        /* height:100%; */
    }
    .bottom{
        position:absolute;
        background-color: #2c3e50;
        width: 100%;
        height: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>