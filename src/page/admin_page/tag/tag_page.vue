<template>
    <div class="tag-list-container">
        <div class="tag-table-top">
            <div class="tag-name-input-icon">
                <el-input class="name-input" clearable v-model="TagPageQueryDTO.tagName" placeholder="输入名称匹配"/>
                <el-button class="name-button" type="primary" @click="get_tag_list">
                    搜索
                    <el-icon><Search/></el-icon>
                </el-button>
                <el-button class="add-button" type="success" @click="showAddDialog">
                    新增标签
                    <el-icon><Plus/></el-icon>
                </el-button>
            </div>
        </div>
        <div class="table-message">
            <el-table :data="tag.List" style="height: 575px;" :row-style="{height: '71px'}">
                <el-table-column prop="tagName" label="标签名"></el-table-column>
                <el-table-column prop="tagStatus" label="标签状态">
                    <template #default="scope">
                        <div v-if="scope.row.tagStatus===1">展示中</div>
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
                                :type="scope.row.tagStatus === 0 ? 'success' : 'warning'"
                                @click="handleStatus(scope.row)"
                            >
                                {{ scope.row.tagStatus === 0 ? '上架' : '下架' }}
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
            <el-pagination layout="prev,pager,next" :page-size="TagPageQueryDTO.pageSize" :total="tag.total" @current-change="handle_change_page"/>
        </div>
        
        <!-- 编辑标签弹窗 -->
        <el-dialog v-model="show_edit_dialog" title="编辑标签">
            <el-form ref="editForm" :model="editTagForm" :rules="editRules" label-width="80px">
                <el-form-item label="标签名" prop="tagName" required>
                    <el-input v-model="editTagForm.tagName" placeholder="请输入标签名"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="cancelEdit">取消</el-button>
                <el-button type="primary" @click="confirmEdit">确定</el-button>
            </template>
        </el-dialog>
        
        <!-- 新增标签弹窗 -->
        <el-dialog v-model="show_add_dialog" title="新增标签">
            <el-form ref="addForm" :model="addTagForm" :rules="addRules" label-width="80px">
                <el-form-item label="标签名" prop="tagAddDTO.tagName" required>
                    <el-input v-model="addTagForm.tagAddDTO.tagName" placeholder="请输入标签名"></el-input>
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
import { page_query_tag, update_tag_status, update_tag, delete_tag, add_tag } from './tag_page_api';
import { message } from '@/util/message_util/message_util';

export default{
    data(){
        return{
            // 后端获得的数据
            tag:{List:[],total:''},
            
            //请求对象
            TagPageQueryDTO:{
                tagName:'',
                page:1,
                pageSize:8
            },
            //编辑标签相关
            show_edit_dialog: false,
            editTagForm: {
                id: '',
                tagName: ''
            },
            editRules: {
                tagName: [
                    { required: true, message: '请输入标签名', trigger: 'blur' }
                ]
            },
            //新增标签相关
            show_add_dialog: false,
            addTagForm: {
                tagAddDTO: { tagName: '' }
            },
            addRules: {
                "tagAddDTO.tagName": [
                    { required: true, message: '请输入标签名', trigger: 'blur' }
                ]
            }
        }
    },
    async mounted(){
        const response = await page_query_tag(this.TagPageQueryDTO);
        this.tag.List = response.data.data.records;
        this.tag.total = response.data.data.totals;
        console.log(this.tag);
    },
    methods:{
        handleEdit(row){
            //编辑按钮
            this.editTagForm.id = row.id;
            this.editTagForm.tagName = row.tagName;
            this.show_edit_dialog = true;
        },
        async handleStatus(row){
            //上下架按钮
            try {
                const newStatus = row.tagStatus === 0 ? 1 : 0;
                const response = await update_tag_status(newStatus, row.id);
                
                if(response.data.code === 0) {
                    // 更新本地数据
                    row.tagStatus = newStatus;
                    message('success', `标签已${newStatus === 1 ? '上架' : '下架'}`);
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
                await this.$confirm('确定要删除该标签吗？此操作不可恢复！', '删除确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                const response = await delete_tag(row.id);
                
                if(response.data.code === 0) {
                    message('success', '删除成功');
                    // 刷新列表
                    this.get_tag_list();
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
            this.TagPageQueryDTO.page = currentPage;
            const response = await page_query_tag(this.TagPageQueryDTO);
            this.tag.List = response.data.data.records;
            this.tag.total = response.data.data.totals;
        },
        async get_tag_list(){
            //名称输入框后面的按钮点击事件，分页查询按钮
            const response = await page_query_tag(this.TagPageQueryDTO);
            this.tag.List = response.data.data.records;
            this.tag.total = response.data.data.totals;
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
                
                // 调用API更新标签
                const response = await update_tag(this.editTagForm);
                
                if(response.data.code === 0) {
                    message('success', '标签更新成功');
                    this.show_edit_dialog = false;
                    // 刷新标签列表
                    this.get_tag_list();
                } else {
                    message('error', response.data.message || '更新失败');
                }
            } catch (error) {
                if(error !== false) { // 不是表单验证错误
                    console.error('更新标签失败:', error);
                    message('error', '操作失败，请重试');
                }
            }
        },
        showAddDialog() {
            // 显示新增标签弹窗
            this.addTagForm.tagAddDTO.tagName = '';
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
                
                // 调用API新增标签
                const response = await add_tag(this.addTagForm.tagAddDTO);
                
                if(response.data.code === 0) {
                    message('success', '标签新增成功');
                    this.show_add_dialog = false;
                    // 刷新标签列表
                    this.get_tag_list();
                } else {
                    message('error', response.data.message || '新增失败');
                }
            } catch (error) {
                if(error !== false) { // 不是表单验证错误
                    console.error('新增标签失败:', error);
                    message('error', '操作失败，请重试');
                }
            }
        }
    }
}
</script>
<style scoped>
    .tag-list-container{
        width:100%;
        height:100%;
    }
    .tag-table-top{
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
    .tag-name-input-icon{
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