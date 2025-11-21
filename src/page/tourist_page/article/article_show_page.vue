<template>
    <div class="art-container">
        <div class="select-area">
                <div class="select-area-name-input">
                    <el-input v-model="ArticleListDTO.articleTitle" clearable placeholder="输入文章名称匹配"></el-input>
                </div>
                <div class="select-area-select-button">
                    <el-button type="primary" @click="select_by_name">
                        <el-icon><search/></el-icon>
                        搜索
                    </el-button>
                </div>
                <div class="select-area-category">


                    <el-select placeholder="请选择文章类型" v-model="ArticleListDTO.categoryId" class="select-area-category" @change="category_change_select" clearable>



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
                    <div class="art-title">文章名：{{item.articleTitle}}</div>
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
        async category_change_select(value){
            //获取当前选择的内容
            
            // console.log(this.checkArticleCate);

            const response = await tourist_get_article_list(this.ArticleListDTO);
            this.artList = response.data.data;

            this.artList.forEach(element => {//将分类ID翻译为分类名称
            const categoryItem = this.category.find(item => item.id === element.categoryId);
            if (categoryItem) {
                element.categoryName = categoryItem.categoryName;
            } else {
                element.categoryName = "未分类";
            }
        });
        },
        async close_tag(item){
            //标签关闭按钮
            // console.log(item);
            this.tags.splice(this.tags.indexOf(item),1);
            this.ArticleListDTO.tagIds.splice(this.ArticleListDTO.tagIds.indexOf(item.id),1);
            
            const response = await tourist_get_article_list(this.ArticleListDTO);
            this.artList = response.data.data;

            this.artList.forEach(element => {//将分类ID翻译为分类名称
            const categoryItem = this.category.find(item => item.id === element.categoryId);
            if (categoryItem) {
                element.categoryName = categoryItem.categoryName;
            } else {
                element.categoryName = "未分类";
            }
        });
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
        async dialog_confirm(){
            //弹窗点击确认，请求后端，
            this.showDialog=false;
            //给DTO的tagId赋值，tags取出id然后填入ArticleListDTO.tagIds

            // console.log("已选标签",this.tags);
            this.tags.forEach(element => {
                this.ArticleListDTO.tagIds.push(element.id);
            });

            // console.log("发送请求，参数：",this.ArticleListDTO);
            const response = await tourist_get_article_list(this.ArticleListDTO);
            this.artList = response.data.data;

            this.artList.forEach(element => {//将分类ID翻译为分类名称
            const categoryItem = this.category.find(item => item.id === element.categoryId);
            if (categoryItem) {
                element.categoryName = categoryItem.categoryName;
            } else {
                element.categoryName = "未分类";
            }
        });
        },


        async select_by_name(){
            //按名称搜索按钮功能
            console.log("搜索按钮被点击",this.ArticleListDTO);
            const response = await tourist_get_article_list(this.ArticleListDTO);
            this.artList = response.data.data;

            this.artList.forEach(element => {//将分类ID翻译为分类名称
            const categoryItem = this.category.find(item => item.id === element.categoryId);
            if (categoryItem) {
                element.categoryName = categoryItem.categoryName;
            } else {
                element.categoryName = "未分类";
            }
        });
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
                'articleTitle':'',
                'tagIds':[],
                'categoryId':''
            },


            category:[],//存储后端分类对象
            tags:[],//已选标签
            allTags:[],//存储后端所有标签
            artList:[],//后端给的文章列表


            // checkArticleCate:'',

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
        padding: 0 30px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-content: flex-start;
        gap: 30px;
        overflow-y: auto;
    }
    .art-show-main-card{
        position: relative;
        background-color: #ffffff;
        border-radius: 16px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        width: 380px;
        height: 480px;
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: pointer;
    }
    .art-show-main-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    }
    .art-cover-img{
        /* 封面 */
        position: relative;
        width: 100%;
        height: 220px;
        overflow: hidden;  
    }
    .art-cover-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
        border-radius: 16px 16px 0 0;
    }
    .art-cover-img img:hover {
        transform: scale(1.05);
    }
    .art-title-and-cate-and-tag{
        /* 文章分类信息和标签 */
        position: relative;
        padding: 20px;
        width: 100%;
        box-sizing: border-box;
    }
    .art-title{
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 12px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.4;
        height: auto;
        max-height: 50.4px;
    }
    .art-cate{
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
    }
    .art-cate::before {
        content: "";
        display: inline-block;
        width: 4px;
        height: 14px;
        background-color: #409EFF;
        margin-right: 6px;
        border-radius: 2px;
    }
    .art-tag{
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }
    .art-tag > div:first-child {
        font-size: 14px;
        color: #666;
        margin-right: 6px;
    }
    .art-time{
        font-size: 13px;
        color: #999;
        display: flex;
        align-items: center;
        margin-bottom: 12px;
    }
    .art-time > div:first-child {
        margin-right: 6px;
    }
    .art-summary{
        /* 文章摘要区域 */
        font-size: 14px;
        color: #666;
        line-height: 1.6;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        padding: 0 20px 20px;
        box-sizing: border-box;
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