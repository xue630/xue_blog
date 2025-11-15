<template>
    <div class="art-container">
        <div class="select-area">
                <div class="select-area-name-input">
                    <el-input clearable placeholder="输入文章名称匹配"></el-input>
                </div>
                <div class="select-area-select-button">
                    <el-button type="primary" @click="select_by_name">
                        <el-icon><search/></el-icon>
                        搜索
                    </el-button>
                </div>
                <div class="select-area-category">


                    <el-select placeholder="请选择文章类型" v-model="checkArticleCate" class="select-area-category" @change="category_change_select">



                    <el-option v-for="(item) in category" :key="item.id" :label="item.categoryName" :value="item.id" />



                </el-select>
                </div>
                <div class="select-area-tag-area">
                    <div class="select-area-tag-button">
                        <el-button type="primary" style="width: 25%; height: 50%;" @click="open_dialog">修改标签</el-button>
                    </div>
                    <div class="select-area-tag-label">
                        <el-tag v-for="item in tags" :key="item.id" closable @close="close_tag(item)">{{item.tagName}}</el-tag>
                    </div>
                    <el-dialog v-model="showDialog" >
                        <el-checkbox-group v-model="tags" @change="get_tag_list">
                            <el-checkbox v-for="item in allTags" :key="item.id" :value="item">{{item.tagName}}</el-checkbox>
                        </el-checkbox-group>
                        <template #footer>
                            <el-button @click="dialog_cannel">取消</el-button>
                            <el-button type="primary" @click="dialog_confirm">确定</el-button>
                        </template>
                    </el-dialog>
                </div>
        </div>
        <div class="art-show-main">

            <div class="art-show-main-card" v-for="item in artList" :key="item.id" @click="click_art_card(item)">
                <div class="art-cover-img">
                    <img :src="item.coverImage" alt="文章封面" style="height:100%;width:100%;margin:0;padding:0;border-radius: 20px;">
                </div>


                <div class="art-title-and-cate-and-tag">
                    <div class="art-title">文章名：{{item.articleName}}</div>
                    <div class="art-cate">类型：{{item.categoryName}}</div>
                    <div class="art-tag">
                        <div>标签：</div>
                        <div><el-tag v-for="tag_item in item.tags" :key="tag_item.id">{{tag_item.tagName}}</el-tag></div>                 
                    </div>
                    <div class="art-time">
                        <div>创建时间：</div>
                        <!-- 展示创建时间 -->
                        <div>{{formatDate(item.createTime)}}</div>
                    </div>
                </div>



                <div class="art-summary">
                    {{item.articleSummary}}
                </div>
            </div>


        </div>
    </div>
</template>
<script>
import { tourist_get_article_list,tourist_get_all_category,tourist_get_all_tag } from './tourist_article_api';
import { StorageHelper } from '@/config/local_storage';
export default{

    methods:{
        category_change_select(value){
            //获取当前选择的内容
            console.log("value:",value);
            console.log(this.checkArticleCate);
        },
        close_tag(item){
            //标签关闭按钮
            console.log(item);
            this.tags.splice(this.tags.indexOf(item),1);
        },
        get_tag_list(value){
            //获取弹窗的列表
            console.log(value);
        },
        open_dialog(){
            //开启弹窗按钮
            this.oldTag = this.tags;
            this.showDialog=true;
        },
        dialog_cannel(){
            //弹窗点击取消
            this.tags=this.oldTag;
            this.oldTag='';
            this.showDialog=false;
        },
        dialog_confirm(){
            //弹窗点击确认
            this.showDialog=false;
        },
        select_by_name(){
            //按名称搜索按钮功能
        },
        click_art_card(item){
            //点击卡片触发信息
            console.log(item);
            console.log(item.articleUrl);
            StorageHelper.setItem('articleId',item.id);
            this.$router.push('/article/detail');
        },
        formatDate(dateString) {
            // 格式化日期
            if (!dateString) return '';
            
            // 直接使用字符串分割处理
            // 格式为 "yyyy-MM-dd HH:mm:ss" 或类似格式
            let dateParts = null;
            let count = -1;
            let i="";
            dateString.forEach(element =>{
                if(count===2){
                    i=' ';
                }else if(count<=2){
                    i='-'
                }else{
                    i=':'
                }
                if(dateParts===null){
                    dateParts=element;
                }else{
                    dateParts=dateParts+i+element;
                }
                count++;
            });
            
            return dateParts; // 直接返回日期部分
        }
    },
    data(){
        return{
            //DTO
            ArticleListDTO:{//用于请求文章列表
                'articleName':'',
                'tagIds':[],
                'categoryId':''
            },


            category:[],//存储后端分类对象
            tags:[],//已选标签
            allTags:[],//存储后端所有标签
            artList:[],//后端给的文章列表


            checkArticleCate:'',

            oldTag:'',//因为弹窗取消复位
            
            showDialog:false,

            

        }
    },
    async mounted(){
        const response = await tourist_get_article_list(this.ArticleListDTO);
        const all_category = await tourist_get_all_category();
        const all_tag = await tourist_get_all_tag();

        // console.log(response.data);
        // console.log(all_category.data);
        // console.log(all_tag.data);


        this.artList = response.data.data;
        this.category = all_category.data.data;
        this.allTags = all_tag.data.data;
        console.log(response);
        console.log(this.category);


        this.artList.forEach(element => {//将分类ID翻译为分类名称
            const categoryItem = this.category.find(item => item.id === element.categoryId);
            if (categoryItem) {
                element.categoryName = categoryItem.categoryName;
            } else {
                element.categoryName = "未分类";
            }
        });
        console.log(this.artList)
    }
}
</script>
<style scoped>
    .art-container{
        /* background-color: aquamarine; */
        height:100%;
        width: 100%;
    }
    .art-show-main{
        position: absolute;
        top: 20%;
        width: 100%;
        height: 80%;
        /* background-color: aqua; */
        display: flex;
        flex-wrap: wrap;
    }
    .art-show-main-card{
        position: relative;
        background-color: rgba(194, 202, 202, 0.4);
        border-radius: 20px;
        margin-top: 40px;
        margin-left: 100px;
        margin-right: 60px;
        width: 550px;
        height: 350px;
    }
    .art-cover-img{
        /* 封面 */
        position: absolute;
        /* left: 75px; */
        width: 250px;
        height: 200px;  
    }
    .art-title-and-cate-and-tag{
        /* 文章分类信息和标签 */
        position: absolute;
        left: 250px;
        width: 300px;
        height: 200px;
        /* display: flex; */
        /* background-color: aquamarine; */
    }
    .art-title{
        position: absolute;
        /* background-color: blue; */
        top: 0px;
        width: 300px;
        height:40px;
        flex-wrap: wrap;
        overflow-y:auto;
    }
    .art-cate{
        position: absolute;
        /* background-color: rgb(40, 175, 96); */
        top: 40px;
        width: 300px;
        height: 40px;
    }
    .art-tag{
        position: absolute;
        /* background-color: rgb(146, 139, 44); */
        top: 80px;
        width: 300px;
        height: 60px;
        /* height: 150px; */
        display: flex;
        flex-wrap: wrap;
    }
    .art-time{
        position: absolute;
        /* background-color: rgb(116, 161, 82); */
        width: 300px;
        top: 140px;
        height: 60px;
    }
    .art-summary{
        /* 文章摘要区域 */
        position: absolute;
        /* background-color: blue; */
        width: 550px;
        height: 150px;
        top: 200px;
        display: flex;
        flex-wrap: wrap;
        overflow-y:auto;
    }
    .art-summary:hover{
        color: rgb(203, 175, 138);
    }
    .select-area{
        position: absolute;
        top:0%;
        width: 100%;
        height: 20%;
        /* background-color: antiquewhite; */
    }
    .select-area-name-input{
        position:absolute;
        /* background-color: aquamarine;  */
        top: 35%;
        left: 13%;
        width: 15%;
    }
    .select-area-select-button{
        position: absolute;
        left: 30%;
        top: 35%;
    }
    .select-area-category{
        position: absolute;
        background-color: bisque;
        left: 30%;
        width: 40%;
        top: 35%;
        /* width: 15%; */
    }
    .select-area-tag-area{
        position: absolute;
        left: 65%;
        width: 30%;
        height: 100%;
        /* background-color: aquamarine; */
    }
    .select-area-tag-button{
        /* background-color: aliceblue; */
        position: absolute;
        height: 35%;
        width: 100%;
        display:flex;
        justify-content: center;
        align-items: center;

    }
    .select-area-tag-label{
        position: absolute;
        top: 35%;
        width: 100%;
        height: 65%;
        /* background-color: rgb(47, 135, 77); */
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }
</style>