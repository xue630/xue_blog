<template>
    <div class="category-list-container">
        <div class="category-table-top">
            <div class="category-name-input-icon">
                <el-input class="name-input" clearable v-model="CategoryPageQueryDTO.categoryName" placeholder="输入名称匹配"/>
                <el-button class="name-button" type="primary" @click="get_category_list">
                    搜索
                    <el-icon><Search/></el-icon>
                </el-button>
                <el-button class="add-button" type="success" @click="showAddDialog">
                    新增分类
                    <el-icon><Plus/></el-icon>
                </el-button>
            </div>
        </div>
        <div class="table-message">
            <el-table :data="category.List" style="height: 575px;" :row-style="{height: '71px'}">
                <el-table-column prop="categoryName" label="分类名"></el-table-column>
                <el-table-column prop="categoryStatus" label="分类状态">
                    <template #default="scope">
                        <div v-if="scope.row.categoryStatus===1">展示中</div>
                        <div v-else>下架</div>
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
                                :type="scope.row.categoryStatus === 0 ? 'success' : 'warning'"
                                @click="handleStatus(scope.row)"
                            >
                                {{ scope.row.categoryStatus === 0 ? '上架' : '下架' }}
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
            <el-pagination layout="prev,pager,next" :page-size="CategoryPageQueryDTO.pageSize" :total="category.total" @current-change="handle_change_page"/>
        </div>
        
        <!-- 编辑分类弹窗 -->
        <el-dialog v-model="show_edit_dialog" title="编辑分类">
            <el-form ref="editForm" :model="editCategoryForm" :rules="editRules" label-width="80px">
                <el-form-item label="分类名" prop="categoryName" required>
                    <el-input v-model="editCategoryForm.categoryName" placeholder="请输入分类名"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="cancelEdit">取消</el-button>
                <el-button type="primary" @click="confirmEdit">确定</el-button>
            </template>
        </el-dialog>
        
        <!-- 新增分类弹窗 -->
        <el-dialog v-model="show_add_dialog" title="新增分类">
            <el-form ref="addForm" :model="addCategoryForm" :rules="addRules" label-width="80px">
                <el-form-item label="分类名" prop="categoryAddDTO.categoryName" required>
                    <el-input v-model="addCategoryForm.categoryAddDTO.categoryName" placeholder="请输入分类名"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="cancelAdd">取消</el-button>
                <el-button type="primary" @click="confirmAdd">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { page_query_category, update_category_status, update_category, delete_category, add_category } from './category_page_api';
import { message } from '@/util/message_util/message_util';

export default{
    data(){
        return{
            // 后端获得的数据
            category:{List:[],total:''},

            //请求对象
            CategoryPageQueryDTO:{
                categoryName:'',
                page:1,
                pageSize:8
            },
            //编辑分类相关
            show_edit_dialog: false,
            editCategoryForm: {
                id: '',
                categoryName: ''
            },
            editRules: {
                categoryName: [
                    { required: true, message: '请输入分类名', trigger: 'blur' }
                ]
            },
            //新增分类相关
            show_add_dialog: false,
            addCategoryForm: {
                categoryAddDTO:{categoryName:''}
            },

            addRules: {
                "categoryAddDTO.categoryName": [
                    { required: true, message: '请输入分类名', trigger: 'blur' }
                ]
            }
        }
    },
    async mounted(){
        const response = await page_query_category(this.CategoryPageQueryDTO);
        this.category.List = response.data.data.records;
        this.category.total = response.data.data.totals;
        console.log(this.category);
    },
    methods:{
        handleEdit(row){
            //编辑按钮
            this.editCategoryForm.id = row.id;
            this.editCategoryForm.categoryName = row.categoryName;
            this.show_edit_dialog = true;
        },
        async handleStatus(row){
            //上下架按钮
            try {
                const newStatus = row.categoryStatus === 0 ? 1 : 0;
                const response = await update_category_status(newStatus, row.id);
                
                if(response.data.code === 0) {
                    // 更新本地数据
                    row.categoryStatus = newStatus;
                    message('success', `分类已${newStatus === 1 ? '上架' : '下架'}`);
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
                await this.$confirm('确定要删除该分类吗？此操作不可恢复！', '删除确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                const response = await delete_category(row.id);
                
                if(response.data.code === 0) {
                    message('success', '删除成功');
                    // 刷新列表
                    this.get_category_list();
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
            this.CategoryPageQueryDTO.page = currentPage;
            const response = await page_query_category(this.CategoryPageQueryDTO);
            this.category.List = response.data.data.records;
            this.category.total = response.data.data.totals;
        },
        async get_category_list(){
            //名称输入框后面的按钮点击事件，分页查询按钮
            const response = await page_query_category(this.CategoryPageQueryDTO);
            this.category.List = response.data.data.records;
            this.category.total = response.data.data.totals;
        },
        cancelEdit() {
            // 取消编辑
            this.show_edit_dialog = false;
            this.$refs.editForm.resetFields();
        },
        async confirmEdit() {
            // 确认编辑
            try {
                // 表单验证
                await this.$refs.editForm.validate();
                
                // 调用API更新分类
                const response = await update_category(this.editCategoryForm);
                
                if(response.data.code === 0) {
                    message('success', '分类更新成功');
                    this.show_edit_dialog = false;
                    // 刷新分类列表
                    this.get_category_list();
                } else {
                    message('error', response.data.message || '更新失败');
                }
            } catch (error) {
                if(error !== false) { // 不是表单验证错误
                    console.error('更新分类失败:', error);
                    message('error', '操作失败，请重试');
                }
            }
        },
        showAddDialog() {
            // 显示新增分类弹窗
            this.addCategoryForm.categoryAddDTO.categoryName = '';
            this.show_add_dialog = true;
        },
        cancelAdd() {
            // 取消新增
            this.show_add_dialog = false;
            this.$refs.addForm.resetFields();
        },
        async confirmAdd() {
            // 确认新增
            try {
                // 表单验证
                await this.$refs.addForm.validate();
                
                // 调用API新增分类
                const response = await add_category(this.addCategoryForm.categoryAddDTO);
                
                if(response.data.code === 0) {
                    message('success', '分类新增成功');
                    this.show_add_dialog = false;
                    // 刷新分类列表
                    this.get_category_list();
                } else {
                    message('error', response.data.message || '新增失败');
                }
            } catch (error) {
                if(error !== false) { // 不是表单验证错误
                    console.error('新增分类失败:', error);
                    message('error', '操作失败，请重试');
                }
            }
        }
    }
}
</script>
<style scoped>
    .category-list-container{
        width:100%;
        height:100%;
    }
    .category-table-top{
        position: absolute;
        top:0;
        height: 15%;
        width: 100%;
    }
    .table-message{
        position: absolute;
        top:15%;
        height:71%;
        width: 100%;
    }
    .table-pagination{
        position: absolute;
        top: 89%;
        width:60%;
        left: 21%;
        height: 8%;
        display: flex;
        place-items: center;
        justify-content: center;
        align-items: center;
    }
    .category-name-input-icon{
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
    .add-button{
        position: absolute;
        left:38%;
        top:32%;
    }
</style>