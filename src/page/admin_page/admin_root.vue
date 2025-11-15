<template>
    <div class="container">
        <div class="header">
            <div class="profile-photo">
                <button class="img-button">
                    <img src="https://xuebucket1.oss-cn-beijing.aliyuncs.com/cf11895a-158b-4643-97a7-acb30d471314.png" alt="头像" style="height:100%;width:100%;margin:0;padding: 0;border-radius: 50%;">
                </button>
            
            </div>
            <div class="header-select-box">
                <el-select @change="change_on_header" placeholder="">
                    <el-option value="1" label="退出登录"></el-option>
                    <el-option value="2" label="修改头像"></el-option>
                    <el-option value="3" label="修改密码"></el-option>
                </el-select>
            </div>
            <div class="header-chat">
                <el-icon size="35"><ChatRound/></el-icon>
            </div>
        </div>
        <div class="aside">
            <div class="header-title">
                <el-icon><notebook/></el-icon>
                博客管理系统
            
            </div>
            <el-menu :default-active="now_page" class="aside-nav" @select="select">
                <el-menu-item index="1" class="aside-nav-item">
                    <el-icon><house/></el-icon>
                    主页信息
                </el-menu-item>
                <el-menu-item index="2" class="aside-nav-item">
                    <el-icon><document/></el-icon>
                    文章列表
                </el-menu-item>
                <el-menu-item index="3" class="aside-nav-item">
                    <el-icon><folder-opened/></el-icon>
                    分类管理
                </el-menu-item>
                <el-menu-item index="4" class="aside-nav-item">
                    <el-icon><price-tag/></el-icon>
                    标签管理
                </el-menu-item>
                <el-menu-item index="5" class="aside-nav-item">
                    <el-icon><data-line/></el-icon>
                    数据统计
                </el-menu-item>
            </el-menu>
        </div>
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import { message } from '@/util/message_util/message_util';
import { logout } from './admin_root_api';

export default{
    methods:{
        async logout(){
            const response = await logout();
            if(response.data.code===0){
                message('success','退出登录成功');//正常退出
                this.$router.push('/login');
            }else{
                message('error',response.data.message);//用户信息过期退出
                this.$router.push('/login');
            }
        },
        select(index){
            if(index==='2'){
                console.log('切换到页面',index);
                this.$router.push('/admin/article')
            }else if(index==='3'){
                console.log('切换到页面',index);
                this.$router.push('/admin/category')
            }else if(index==='4'){
                console.log('切换到页面',index);
                this.$router.push('/admin/tag')
            }else if(index==='5'){
                console.log('切换到页面',index);
                this.$router.push('/admin/data')
            }else{
                console.log('切换到页面',index);
                this.$router.push('/admin')
            }
        },
        async change_on_header(value){
            if(value==="3"){
                console.log("修改密码");
            }else if(value==="2"){
                console.log("修改头像");
            }else{
                console.log("退出登录");
                await this.logout();
            }
        }
    },
    mounted(){
        // 获取当前路由路径
        const currentPath = this.$route.path;
        if(currentPath==="/admin"){
            this.now_page="1";
        }else if(currentPath==="/admin/article"){
            this.now_page="2"
        }else if(currentPath==="/admin/category"){
            this.now_page="3";
        }else if(currentPath==="/admin/tag"){
            this.now_page="4";
        }else{
            this.now_page="4";
        }
    },
    data(){
        return{
            now_page:'1'
        }
    }
}
</script>
<style scoped>
    .container{
        min-height:100vh;
        /* background-color: black; */
        /* min-width: 100vh; */
    }
    .header{
        position:absolute;
        background-color: rgb(42, 42, 71);
        top:0%;
        left:17%;
        height:9%;
        width:83%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .aside{
        position:absolute;
        top:0%;
        height:100%;
        left:0%;
        width:17%;
        background-color: rgb(30, 30, 55);
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
        z-index:100;
        display: flex;
        flex-direction: column;
    }
    .main{
        position:absolute;
        left:17%;
        top:9%;
        width:83%;
        height:90%;
        /* background-color: aquamarine; */
    }
    .aside-nav{
        background-color: transparent;
        width: 100%;
        flex: 1;
        border: none;
    }
    .aside-nav-item:hover{
        background-color: rgba(255, 255, 255, 0.1);
        color: #fff;
    }
    .aside-nav-item.is-active{
        background-color: rgba(70, 130, 220, 0.7);
        color: #fff;
        position: relative;
    }
    .aside-nav-item.is-active::before{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 4px;
        background-color: #fff;
    }
    .aside-nav-item{
        display:flex;
        align-items: center;
        font-size: 15px;
        height:56px;
        color: rgba(255, 255, 255, 0.85);
        padding-left: 20px;
        transition: all 0.3s ease;
        margin: 4px 8px;
        border-radius: 6px;
    }
    .aside-nav-item .el-icon{
        margin-right: 10px;
        font-size: 18px;
    }
    .logout-button{
        position: absolute;
        right:1%;
        bottom: 25%;
    }
    .header-title{
        /* 移除背景色 */ 
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 500;
        color: #fff;
        font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
        gap: 10px;
        padding: 20px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 10px;
    }
    .header-title .el-icon{
        font-size: 24px;
        color: rgba(255, 255, 255, 0.9);
    }
    .header-chat{
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: white;
    }
    .profile-photo{
        height: 40px;
        width: 40px;
    }
    .img-button{
        width: 100%;
        height:100%;
        padding: 0;
        border-radius: 50%;
        border: none;
        background: none;
        cursor: pointer;
    }
    .header-left{
        display: flex;
        align-items: center;
    }
    
    .header-right{
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .header-select-box{
        width: auto;
    }
</style>