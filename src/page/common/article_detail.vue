<template>
    <div class="container">
        <div class="catalog">
            <el-button type="primary" @click="back_article_page">返回文章页</el-button>
            <h1>目录</h1>
            <ul class="toc-list">
                <li v-for="item in catalogue" :key="item.id" :class="'toc-level-' + item.level">
                    <a href="javascript:void(0)" @click="scrollToHeading(item.id)" class="catalog-item">{{ item.text }}</a>
                </li>
            </ul>
        </div>
        <div class="main" v-html="content">
            
        </div>
    </div>
</template>
<script>
import axios from '@/config/axios_config';
import { catalogue, md } from '@/config/markdown_config';
import { StorageHelper } from '@/config/local_storage';

export default{
    data(){
        return{
            content:'',//文章内容
            catalogue:[]//目录列表
        }
    },
    methods:{
        async request_test(){//测试方法，根据文章id获取后端文本流
            const response = await axios.get('common/articleContent',
                {
                    params:{
                        id:StorageHelper.getItem('articleId')
                    }
                }
            );
            this.content = md.render(response.data.data);//请求到md文档json流
            this.catalogue = catalogue(response.data.data);
            console.log('获得文章id',StorageHelper.getItem('articleId'))
            console.log(this.catalogue);
        },
        back_article_page(){
            this.$router.push('/article');
            // window.location.reload();
        },
        scrollToHeading(id) {//点击目录滚动功能
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    },
    mounted(){
       this.request_test();
    }
}
</script>
<style >
.container{
    min-height: 100vh;
    display: flex;
    width: 100%;
    /* background-color: aqua; */
}
.catalog{
    width: 19%;
    /* background-color: azure; */
    height: 100vh;
    overflow: auto;
    position: sticky;
    top: 0;
}
.main{
    width: 81%;
    height: 100%;
    /* background-color: beige; */
}
/* 直接选择markdown-it生成的表格 */

table{
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
  width: 1000px;
}
th{
  background: #f6f8fa;
  border: 1px solid #dfe2e5;
  padding: 6px 5px;
  font-weight: 600;
}

td{
  border: 1px solid #dfe2e5;
  padding: 6px 5px;
}

tr:nth-child(2n) {
  background-color: #f6f8fa;
}
img {
    width:900px;
    height: 500px;
}

/*美化目录 */
.catalog-item {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
} 
 .catalog-item{
  display: block;
  padding: 12px 20px;
  margin: 8px 0;
  background: #f8f9fa;
  border-left: 4px solid #4e73df;
  border-radius: 0 8px 8px 0;
  text-decoration: none;
  color: #2d3748;
  font-family: 'Segoe UI', sans-serif;
  transition: all 0.3s ease;
  position: relative;
}
.toc-level-2 { margin-left: 20px; border-left-color: #6c757d; }
.toc-level-3 { margin-left: 40px; border-left-color: #858796; }
.toc-level-4 { margin-left: 60px; border-left-color: #b7b9cc; }
.catalog-item:hover {
  background: #4e73df;
  color: white;
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(78, 115, 223, 0.3);
}
.catalog-item:active {
  background: #4e73df;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(78, 115, 223, 0.4);
}


ul{/*去除表格样式 */
  list-style-type: none; /* 关键属性 */
  padding-left: 0;
}
</style>