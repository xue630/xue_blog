<template>
    <div class="container">
        <!-- <h1>登录页面</h1> -->
        <div class="main">
            <div class="form">
                <div class="input-box">
                    <div class="input-user-icon">
                        <el-icon><User /></el-icon>
                        <el-input class="input-username" v-model="user.username" clearable placeholder="请输入账号"></el-input>
                    </div>
                    
                    <div class="input-lock-icon">
                        <el-icon><Lock/></el-icon>
                        <el-input class="input-password" v-model="user.password" clearable placeholder="请输入密码" show-password></el-input>
                    </div>
                    <el-button plain round class="login-button" :loading="isLoading" @click="request_login(user)">登录</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { login } from './login_page_request';
import { message } from '@/util/message_util/message_util';

export default{
    data(){
        return{
            user:{
                username:'',
                password:''
            },
            isLoading:false
        }
    },
    methods:{
        async request_login(data){
            this.isLoading=true;
            const response = await login(data);
            console.log(response);
            if(response.data.code===0){
                message('success',response.data.data.name+'欢迎登录');
                this.isLoading=false;
                this.$router.push('/admin');
            }else{
                message('error',response.data.message);
                this.isLoading=false;
            }
        }
    }
}
</script>

<style scoped>
    .container{
        background-color: rgb(167, 188, 202);
        height: 100vh;
    }
    .main{
        position:absolute;
        background-image:url('./login.jpg');
        background-size:cover ;
        background-position:center ;
        background-repeat: no-repeat;
        opacity:0.7;
        top:15%;
        height:70%;
        left:15%;
        width:70%;
    }
    .form{
        position:absolute;
        background-color: rgb(224, 217, 217,0.4);
        /* opacity:0.4; */
        top:15%;
        height:70%;
        left:50%;
        width:40%;
    }
    .input-box{
        position:absolute;
        /* background-color: aqua; */
        top:15%;
        height:50%;
        left:10%;
        width:80%;
    }
    .input-user-icon{
        position:absolute;
        top:10%;
        height:10%;
        left:5%;
        width: 80%;
        /* float:left; */
        
    }
    .input-lock-icon{
        position:absolute;
        top:30%;
        height:10%;
        left:5%;
        width: 80%;
        /* float:left; */
    }
    .input-username{
        position:absolute;
        float: left;
    }
    .input-password{
        position: absolute;
        float: left;
    }
    .login-button{
        position:absolute;
        top:80%;
        height: 10%;
        left: 30%;
        width:40%;
        background-color: yellow;
        color:black
    }
    .login-button:hover{
        color:rgb(179, 151, 151);
    }
</style>