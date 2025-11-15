<template>
    <div class="article-list-container">
        <div class="article-table-top">
            <div class="article-name-input-icon">
                <el-input class="name-input" clearable v-model="ArticlePageQueryDTO.articleName" placeholder="输入名称匹配"/>
                <el-button class="name-button" type="primary" @click="get_article_list">
                    搜索
                    <el-icon><Search/></el-icon>
                </el-button>
            </div>
            <div class="article-category">

                <!-- 将其换成id列表 -->

                <el-select placeholder="请选择文章类型" v-model="ArticlePageQueryDTO.categoryId" class="article-category-select" @change="category_change_select">
                    <!-- 从后端查到类型列表循环渲染 -->
                    <el-option v-for="(item) in category" :key="item.id" :label="item.categoryName" :value="item.id" />
                </el-select>
            </div>
            <div class="article-tag">
                <div class="show-tag">
                        <!-- 用户弹窗选择元素，选项列表用于分页查询 -->
                    <el-tag v-for="item in currentTag" :key="item.id" closable @close="tag_closeHandler(item)">{{item.tagName}}</el-tag>
                </div>
                <div class="tag-select-button">
                    <el-button type="primary" @click="open_dialog" class="tag-select-button-target">修改标签</el-button>

                    <el-dialog v-model="showDialog" >
                        <!-- 复选框 -->
                        <el-checkbox-group v-model="currentTag" @change="dialogChange">
                            <el-checkbox v-for="item in allTags" :key="item.id" :value="item">{{item.tagName}}</el-checkbox>
                        </el-checkbox-group>
                        <template #footer>
                            <el-button @click="dialog_cannel">取消</el-button>
                            <el-button type="primary" @click="dialog_confirm">确定</el-button>
                        </template>
                    </el-dialog>
                </div>
            </div>


            <!-- 添加文章功能正常工作 -->
            <div class="add-article-button">
                <el-button type="primary" size="large" @click="add_article">添加文章</el-button>
                <el-dialog v-model="show_add_article_dialog">
                    <!-- 字段表单 -->
                    <el-form ref="fieldFrom" :model="addArticleDTO" :rules="yield_rules" label-width="100px">
                        <el-form-item label="文章文件名" prop="articleName" required>
                            <el-input v-model="addArticleDTO.articleName" style="width: 60%;"/>
                        </el-form-item>
                        <el-form-item label="文章标题" prop="articleTitle" required>
                            <el-input v-model="addArticleDTO.articleTitle" style="width: 60%;"/>
                        </el-form-item>
                        <el-form-item label="摘要" prop="articleSummary" required>
                            <el-input type="textarea" v-model="addArticleDTO.articleSummary" style="width: 60%;"/>
                        </el-form-item>
                        <el-form-item label="分类" required>
                            <el-select placeholder="请选择文章类型" v-model="addArticleDTO.categoryId" style="width: 60%;">
                                <el-option v-for="(item) in category" :key="item.id" :label="item.label" :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="标签" required>
                            <el-checkbox-group v-model="addArticleDTO.articleTag">
                            <el-checkbox v-for="item in allTags" :key="item.id" :value="item">{{item.tag}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>

                    <!-- 文件表单 -->
                    <el-form :model="addArticleFile" :rules="file_rules" ref="fileForm">
                        <el-form-item label="封面" prop="coverImage" required>
                            <el-upload 
                            action="http://localhost:8080/common/upload"
                            :on-success="img_file_upload_success"
                            :data="addArticleFile.imageFileName"
                            >
                                <el-button type="primary">选择封面</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="文章文件" prop="articleFile" required>
                            <el-upload 
                            action="http://localhost:8080/common/upload"
                            :on-success="file_upload_success"
                            :data="addArticleFile.articleFileName"
                            >
                                <el-button type="primary">选择文章文件</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-form> 
                    <template #footer>
                            <el-button @click="add_dialog_cannel">取消</el-button>
                            <el-button type="primary" @click="add_dialog_confirm">确定</el-button>
                        </template>
                </el-dialog>

                
                <!-- 编辑文章弹窗 -->
                <el-dialog v-model="show_edit_article_dialog" title="编辑文章">
                    <!-- 只读信息 -->
                    <el-form label-width="100px">
                        <el-form-item label="文章文件名">
                            <el-tag>{{ editArticleDTO.articleName }}</el-tag>
                        </el-form-item>
                        <el-form-item label="文章状态">
                            <el-tag :type="editArticleDTO.articleStatus === 1 ? 'success' : 'info'">
                                {{ editArticleDTO.articleStatus === 1 ? '展示中' : '下架' }}
                            </el-tag>
                        </el-form-item>
                    </el-form>
                    
                    <!-- 可编辑信息 -->
                    <el-form ref="editForm" :model="editArticleDTO" :rules="edit_rules" label-width="100px">
                        <el-form-item label="文章标题" prop="articleTitle" required>
                            <el-input v-model="editArticleDTO.articleTitle" style="width: 60%;"/>
                        </el-form-item>
                        <el-form-item label="图片路径" prop="coverImage" required>
                            <el-input v-model="editArticleDTO.coverImage" style="width: 60%;"/>
                        </el-form-item>
                        <el-form-item label="摘要" prop="articleSummary" required>
                            <el-input type="textarea" v-model="editArticleDTO.articleSummary" style="width: 60%;"/>
                        </el-form-item>
                        <el-form-item label="分类" required>
                            <el-select placeholder="请选择文章类型" v-model="editArticleDTO.categoryId" style="width: 60%;">
                                <el-option v-for="(item) in category" :key="item.id" :label="item.categoryName" :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="标签" required>
                            <el-checkbox-group v-model="editArticleDTO.currentTags">
                            <el-checkbox v-for="item in allTags" :key="item.id" :value="item">{{item.tagName}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                    
                    <template #footer>
                        <el-button @click="edit_dialog_cannel">取消</el-button>
                        <el-button type="primary" @click="edit_dialog_confirm">确定</el-button>
                    </template>
                </el-dialog>






            </div>
        </div>


        <div class="table-message">
            <!-- 绑定的列表 -->
            <el-table :data="article.List" style="height: 575px;" :row-style="{height: '71px'}">
                <el-table-column prop="articleTitle" label="文章标题"></el-table-column>
                <el-table-column prop="coverImage" label="文章封面">
                    <template #default="scope">
                        <img :src="scope.row.coverImage" alt="封面" style="height: 50px; width: 100px;" />
                    </template>
                </el-table-column>
                <el-table-column prop="categoryId" label="文章分类"></el-table-column>
                <el-table-column prop="articleName" label="文章文件名"></el-table-column>
                <el-table-column prop="tags" label="标签">
                    <template #default="scope">
                        <el-tag v-for="item in scope.row.tags" :key="item.id">
                            {{item.tagName}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="articleStatus" label="状态">
                    <template #default="scope">
                        <div v-if="scope.row.articleStatus===1">展示中</div>
                        <div v-else>下架</div>
                    </template>
                </el-table-column>
                <el-table-column prop="articleSummary" label="摘要">
                    <template #default="scope">
                        <div class="article-table-summary">
                            {{scope.row.articleSummary}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="operate" label="操作">
                    <template #default="scope">
                        <el-button-group>
                        <el-button 
                            size="small" 
                            type="primary"
                            @click="handleEdit(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-button 
                            size="small" 
                            :type="scope.row.articleStatus === 0 ? 'success' : 'warning'"
                            @click="handleStatus(scope.row)"
                        >
                            {{ scope.row.articleStatus === 0 ? '上架' : '下架' }}
                        </el-button>
                        <el-button 
                            size="small" 
                            type="danger"
                            @click="handleDelete(scope.row)"
                        >
                            删除
                        </el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="table-pagination">
            <el-pagination layout="prev,pager,next" :page-size="ArticlePageQueryDTO.pageSize" :total="article.total" @current-change="handle_change_page"/>
        </div>
    </div>
</template>
<script>
import { add_article,page_query_article,select_allCategory,select_allTag,update_article_status,update_article,delete_article } from './article_api';
import { message } from '@/util/message_util/message_util';
    export default{
        data(){
            return{
     
               
                oldTag:'',
                currentTag:[],

                //弹窗开关
                showDialog:false,
                show_add_article_dialog:false,//添加弹窗
                show_edit_article_dialog:false,//编辑弹窗
                
                // 编辑文章数据
                editArticleDTO:{
                    id:'',
                    articleName:'',
                    articleStatus:0,
                    articleTitle:'',
                    coverImage:'',
                    articleSummary:'',
                    categoryId:'',
                    currentTags:[]
                },


                // 后端获得的数据
                article:{List:[],total:''},
                allTags:[],
                category:[],


                
                //文件表单
                addArticleFile:{
                    imageFileName:{'fileName':'',
                        'type':'png'
                    },
                    coverImage:'',//存放封面文件
                    articleFileName:{'fileName':'',
                        'type':'md'
                    },
                    articleFile:'',//存放文章文件本体
                },

                //请求对象
                addArticleDTO:{
                    articleName:'',//输入框
                    articleTitle:'',//输入框
                    articleSummary:'',//文本域

                    coverImage:'',//文件类型
                    articleUrl:'',//文件类型

                    categoryId:'',//分类，复选框
                    articleTag:[]//复选框
                },

                ArticlePageQueryDTO:{
                    articleName:'',//√
                    tagIds:[],//√
                    page:1,
                    pageSize:8,
                    categoryId:'',//√
                },

                // 编辑表单验证规则
                edit_rules:{
                    articleTitle:[
                        { required: true, message: '请输入文章标题', trigger: ['blur','change'] }
                    ],
                    coverImage:[
                        { required: true, message: '请输入图片路径', trigger: ['blur','change'] }
                    ],
                    articleSummary:[
                        { required: true, message: '请输入摘要', trigger: ['blur','change'] }
                    ],
                    categoryId:[
                        { required: true, message: '请选择分类', trigger: ['blur','change'] }
                    ]
                },
                yield_rules:{
                    articleName:[
                        {required: true, message: '请输入文章名', trigger: ['blur','change'] }//是否必须，验证错误信息，判定时机为失去焦点
                    ],
                    articleTitle: [
                        { required: true, message: '请输入文章标题', trigger: ['blur','change'] }
                    ],
                    articleSummary: [
                        { required: true, message: '请输入摘要', trigger: ['blur','change'] }
                    ]
                },
                file_rules:{

                    imageFileName:[{required: true, message: '请输入封面文件名', trigger: ['blur','change'] }],

                    articleFileName:[{required: true, message: '请输入文章文件名', trigger: ['blur','change'] }],

                    coverImage:[
                        {required: true, message: '请上传封面文件', trigger: 'change',
                        validator: (rule, value, callback) => {
                                    if (!value || value.length === 0) {
                                    callback(new Error('请上传文件'))
                                    } else {
                                    callback()
                                    }}      
                        }
                    ],
                    articleFile:[
                        {required: true, message: '请上传文章主体', trigger: 'change',
                            validator: (rule, value, callback) => {
                                    if (!value || value.length === 0) {
                                    callback(new Error('请上传文件'))
                                    } else {
                                    callback()
                                    }}     
                        }
                    ]
                },
            }
        },
        watch: {
            'addArticleDTO.articleName': function(newVal) {
                // console.log('articleName:', newVal, '长度:', newVal.length);
                this.addArticleFile.articleFileName.fileName=newVal;
                // console.log(this.addArticleFile.articleFileName);
            },
            'addArticleDTO.articleCategory':function(newVal){
                console.log(newVal);
            },
            // 'currentTag':function(newVal){
            //     console.log(newVal);
        
            // }
        },
        async mounted(){
                        
            const getAllCategory = await select_allCategory();//获取所有的分类
            const getAllTag = await select_allTag();//获取所有的标签
            const response = await page_query_article(this.ArticlePageQueryDTO);//查询文章
            // console.log(getAllCategory)
            // console.log(getAllTag)
            this.category = getAllCategory.data.data;
            this.allTags = getAllTag.data.data;
            
            // console.log(response);
            this.article.List = response.data.data.records;//设置List
            this.article.total = response.data.data.totals;//设置总记录

            this.article.List.forEach(element => {//将前端id翻译为前端名称
                element.categoryId = this.category.find(item => item.id === element.categoryId).categoryName;
            });
            console.log(this.article);

        },
        methods:{
            handleEdit(row){
                //列表修改按钮
                // 设置编辑文章的数据
                this.editArticleDTO.id = row.id;
                this.editArticleDTO.articleName = row.articleName;
                this.editArticleDTO.articleStatus = row.articleStatus;
                this.editArticleDTO.articleTitle = row.articleTitle;
                this.editArticleDTO.coverImage = row.coverImage;
                this.editArticleDTO.articleSummary = row.articleSummary;
                
                // 查找分类ID（因为列表中显示的是分类名称）
                const categoryItem = this.category.find(item => item.categoryName === row.categoryId);
                this.editArticleDTO.categoryId = categoryItem ? categoryItem.id : '';
                
                // 设置标签
                this.editArticleDTO.currentTags = [...row.tags];
                
                // 打开编辑弹窗
                this.show_edit_article_dialog = true;
            },
            async handleStatus(row){
                //修改状态按钮
                try {
                    const newStatus = row.articleStatus === 0 ? 1 : 0;
                    const response = await update_article_status(row.id, newStatus);
                    
                    if(response.data.code === 0) {
                        // 更新本地数据
                        row.articleStatus = newStatus;
                        message('success', `文章已${newStatus === 1 ? '上架' : '下架'}`);
                    } else {
                        message('error', response.data.message || '操作失败');
                    }
                } catch (error) {
                    console.error('上下架操作失败:', error);
                    message('error', '操作失败，请重试');
                }
            },
            async handleDelete(row){
                //删除按钮
                try {
                    // 添加确认框
                    await this.$confirm('确定要删除该文章吗？此操作不可恢复！', '删除确认', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    });
                    
                    const response = await delete_article(row.id);
                    
                    if(response.data.code === 0) {
                        message('success', '删除成功');
                        // 刷新列表
                        this.get_article_list();
                    } else {
                        message('error', response.data.message || '删除失败');
                    }
                } catch (error) {
                    if(error === 'cancel') {
                        // 用户取消删除操作
                        return;
                    }
                    console.error('删除操作失败:', error);
                    message('error', '操作失败，请重试');
                }
            },
            async handle_change_page(currentPage){
                //处理分页改变事件
                this.ArticlePageQueryDTO.page = currentPage;
                const response = await page_query_article(this.ArticlePageQueryDTO);
                this.article.List = response.data.data.records;
                this.article.total = response.data.data.totals;
                
                this.article.List.forEach(element => {//将前端id翻译为前端名称
                element.categoryId = this.category.find(item => item.id === element.categoryId).categoryName;
            });

            },
            category_change_select(value){
                //传入下拉框的坐标---
                console.log("value:",value);
            },
            tag_closeHandler(item){
                //label的删除事件，传入的被删除实例
                this.currentTag.splice(this.currentTag.indexOf(item),1);
                this.ArticlePageQueryDTO.tagIds.splice(this.ArticlePageQueryDTO.tagIds.indexOf(item.id),1);

            },
            open_dialog(){
                //开启弹窗按钮---
                this.oldTag = this.tags;
                this.showDialog=true;
            },
            dialog_cannel(){
                //标签弹窗点击取消---
                this.currentTag=this.oldTag;
                this.oldTag='';
                this.showDialog=false;
            },
            dialog_confirm(){
                //标签弹窗点击确认
                this.showDialog=false;
            },


            dialogChange(value){
                //传入的是修改过后的复选框数组----
                console.log(value);
                this.ArticlePageQueryDTO.tagIds.splice(0,this.ArticlePageQueryDTO.tagIds.length);//清空原数组
                value.forEach(element => {
                    this.ArticlePageQueryDTO.tagIds.push(element.id);//再循环放入tag的id
                });
                // console.log(this.ArticlePageQueryDTO.tagIds);
            },


            async get_article_list(){
                //名称输入框后面的按钮点击事件，分页查询按钮----
                // console.log(this.ArticlePageQueryDTO.categoryId);
                const response = await page_query_article(this.ArticlePageQueryDTO);
                this.article.List = response.data.data.records;
                this.article.total = response.data.data.totals;

                this.article.List.forEach(element => {//将前端id翻译为前端名称
                element.categoryId = this.category.find(item => item.id === element.categoryId).categoryName;
                });
            },
            add_article(){
                //点击添加按钮----
                this.show_add_article_dialog=true;
            },
            add_dialog_cannel(){
                //添加弹窗的取消按钮
                this.$refs.fieldFrom.resetFields();
                this.$refs.fileForm.resetFields();
                this.show_add_article_dialog=false;
            },
            async add_dialog_confirm(){
                //添加弹窗的确定按钮
               const response = await add_article(this.addArticleDTO);
               if(response.data.code===1){
                console.log(response);
                 message('error',response.data.message);
               }else{
                 message('success','文章添加成功');
               }
                this.show_add_article_dialog=false;
            },
            img_file_upload_success(response){
                //上传文件成功，获得url赋值给addArticleDTO对应的
                // console.log('上传文件成功回调');
                // console.log(response);
                this.addArticleDTO.coverImage = response.data;
            },
            file_upload_success(response){
                this.addArticleDTO.articleUrl = response.data;
            },
            edit_dialog_cannel(){
                //编辑弹窗的取消按钮
                this.show_edit_article_dialog=false;
            },
            async edit_dialog_confirm(){
                //编辑弹窗的确定按钮
                try {
                    // 表单验证
                    await this.$refs.editForm.validate();
                    
                    // 准备提交数据
                    const tagIds = this.editArticleDTO.currentTags.map(tag => tag.id);
                    const articleData = {
                        id: this.editArticleDTO.id,
                        articleTitle: this.editArticleDTO.articleTitle,
                        articleName: this.editArticleDTO.articleName,
                        coverImage: this.editArticleDTO.coverImage,
                        articleSummary: this.editArticleDTO.articleSummary,
                        categoryId: this.editArticleDTO.categoryId,
                        tagIds: tagIds
                    };
                    
                    // 调用API更新文章
                    const response = await update_article(articleData);
                    
                    if(response.data.code === 0) {
                        message('success', '文章更新成功');
                        this.show_edit_article_dialog = false;
                        // 刷新文章列表
                        this.get_article_list();
                    } else {
                        message('error', response.data.message || '更新失败');
                    }
                } catch (error) {
                    if(error !== false) { // 不是表单验证错误
                        console.error('更新文章失败:', error);
                        message('error', '操作失败，请重试');
                    }
                }
            }
        }
    }
</script>
<style scoped>
    .article-table-summary{
        max-height: 71px; /* 固定高度 */
        overflow-y: auto; /* 垂直滚动条 */
        /* padding: 4px 8px; */
        /* line-height: 1.4; */
        word-break: break-all; /* 长单词换行 */
    }
    .article-list-container{
        width:100%;
        height:100%;
        /* background-color: bisque; */
    }
    .article-table-top{
        position: absolute;
        top:0;
        height: 15%;
        /* background-color: aqua; */
        width: 100%;
    }
    .table-message{
        position: absolute;
        top:15%;
        height:71%;
        width: 100%;
        /* 一页八条 */
        /* background-color: blue; */
    }
    .table-pagination{
        position: absolute;
        /* background-color: antiquewhite; */
        top: 89%;
        width:60%;
        left: 21%;
        height: 8%;
        display: flex;
        place-items: center; 
        justify-content: center;
        align-items: center;
    }
    .article-name-input-icon{
        /* background-color: rgb(31, 59, 59); */
        width:40%;
        height: 100%;
    }
    .name-input{
        position: absolute;
        left: 4%;
        width:25%;
        top:33%;
        height:25%;
    }
    .name-button{
        position: absolute;
        left:30%;
        top:32%;
    }
    .article-category{
        position: absolute;
        /* background-color: black; */
        top: 0%;
        height:100%;
        left:40%;
        width:20%;
        /* z-index:5555555; */
    }
    .article-category-select{
        position: absolute;
        top: 33%;
    }
    .article-tag{
        position: absolute;
        /* background-color: rgb(153, 62, 62); */
        top: 0%;
        height: 100%;
        left: 60%;
        width: 26%;
        /* z-index:200000; */
    }
    .add-article-button{
        position: absolute;
        top: 50%;
        /* height: 100%; */
        /* background-color: black; */
        /* width: 10%; */
        left: 90%;
    }
    .show-tag{
        position: absolute;
        /* background-color: aqua; */
        left: 1%;
        height: 100%;
        width:70%;
        display: flex;
        justify-content: flex-start; /* 改为左对齐 */
        align-items: flex-start; /* 顶部对齐 */
        flex-wrap: wrap; /* 添加这行：允许换行 */
        overflow-y: auto; /* 如果内容过多可以滚动 */
        margin: 0;
        padding: 0;
    }
    .tag-select-button{
        position:absolute;
        /* background-color: blueviolet; */
        right:1%;
        height: 100%;
        width: 25%;

    }
    .tag-select-button-target{
        position: absolute;
        top:32%;
        left:10%;
    }

</style>