<template>
    <div class="dashboard-container">
        <!-- 数据统计卡片 -->
        <div class="stats-container">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-card shadow="hover" class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon article-icon">
                                <el-icon><Document /></el-icon>
                            </div>
                            <div class="stat-info">
                                <div class="stat-value">{{ articleCount }}</div>
                                <div class="stat-label">文章总数</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="hover" class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon category-icon">
                                <el-icon><Folder /></el-icon>
                            </div>
                            <div class="stat-info">
                                <div class="stat-value">{{ categoryCount }}</div>
                                <div class="stat-label">分类总数</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="hover" class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon tag-icon">
                                <el-icon><Collection /></el-icon>
                            </div>
                            <div class="stat-info">
                                <div class="stat-value">{{ tagCount }}</div>
                                <div class="stat-label">标签总数</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="hover" class="stat-card">
                        <div class="stat-content">
                            <div class="stat-icon view-icon">
                                <el-icon><View /></el-icon>
                            </div>
                            <div class="stat-info">
                                <div class="stat-value">{{ viewCount }}</div>
                                <div class="stat-label">总浏览量</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 图表和最新文章 -->
        <div class="content-container">
            <el-row :gutter="20">
                <el-col :span="16">
                    <el-card shadow="hover" class="chart-card">
                        <template #header>
                            <div class="card-header">
                                <span>访问趋势</span>
                                <el-radio-group v-model="timeRange" size="small">
                                    <el-radio-button label="7">最近7天</el-radio-button>
                                    <el-radio-button label="30">最近30天</el-radio-button>
                                    <el-radio-button label="90">最近90天</el-radio-button>
                                </el-radio-group>
                            </div>
                        </template>
                        <div class="chart-container">
                            <!-- 这里可以放置图表组件 -->
                            <div class="chart-placeholder">访问趋势图表</div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="hover" class="recent-card">
                        <template #header>
                            <div class="card-header">
                                <span>最新文章</span>
                                <el-button type="primary" size="small" @click="$router.push('/admin/article')">查看全部</el-button>
                            </div>
                        </template>
                        <div class="article-list">
                            <div v-for="article in recentArticles" :key="article.id" class="article-item">
                                <div class="article-title">{{ article.title }}</div>
                                <div class="article-date">{{ article.createTime }}</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 系统信息和快捷操作 -->
        <div class="bottom-container">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-card shadow="hover" class="system-info-card">
                        <template #header>
                            <div class="card-header">
                                <span>系统信息</span>
                            </div>
                        </template>
                        <div class="system-info">
                            <div class="info-item">
                                <span class="info-label">系统版本：</span>
                                <span class="info-value">Xue Blog v1.0.0</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">运行环境：</span>
                                <span class="info-value">Node.js + Vue 3</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">最后更新：</span>
                                <span class="info-value">2023-11-15</span>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card shadow="hover" class="quick-actions-card">
                        <template #header>
                            <div class="card-header">
                                <span>快捷操作</span>
                            </div>
                        </template>
                        <div class="quick-actions">
                            <el-button type="primary" @click="$router.push('/admin/article/add')">
                                <el-icon><Plus /></el-icon>
                                新建文章
                            </el-button>
                            <el-button type="success" @click="$router.push('/admin/category')">
                                <el-icon><Folder /></el-icon>
                                管理分类
                            </el-button>
                            <el-button type="warning" @click="$router.push('/admin/tag')">
                                <el-icon><Collection /></el-icon>
                                管理标签
                            </el-button>
                            <el-button type="info" @click="$router.push('/')">
                                <el-icon><View /></el-icon>
                                访问前台
                            </el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { Document, Folder, Collection, View, Plus } from '@element-plus/icons-vue';

export default {
    name: 'AdminHome',
    components: {
        Document,
        Folder,
        Collection,
        View,
        Plus
    },
    data() {
        return {
            // 数据统计
            articleCount: 0,
            categoryCount: 0,
            tagCount: 0,
            viewCount: 0,

            // 图表时间范围
            timeRange: '7',

            // 最新文章
            recentArticles: [
                { id: 1, title: 'Vue 3 组合式 API 实践', createTime: '2023-11-15' },
                { id: 2, title: '前端性能优化技巧', createTime: '2023-11-10' },
                { id: 3, title: '响应式布局设计指南', createTime: '2023-11-05' },
                { id: 4, title: 'JavaScript 异步编程', createTime: '2023-10-28' },
                { id: 5, title: 'CSS Grid 布局详解', createTime: '2023-10-20' }
            ]
        };
    },
    mounted() {
        // 获取统计数据
        this.fetchStats();
    },
    methods: {
        // 获取统计数据
        fetchStats() {
            // 这里应该调用API获取实际数据
            // 模拟数据
            this.articleCount = 42;
            this.categoryCount = 8;
            this.tagCount = 15;
            this.viewCount = 3245;
        }
    }
};
</script>

<style>
.dashboard-container {
    padding: 20px;
    height: 100%;
    background-color: #f5f7fa;
}

/* 数据统计卡片 */
.stats-container {
    margin-bottom: 20px;
}

.stat-card {
    height: 100px;
}

.stat-content {
    display: flex;
    align-items: center;
    height: 100%;
}

.stat-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-right: 16px;
    color: white;
    font-size: 24px;
}

.article-icon {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.category-icon {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.tag-icon {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.view-icon {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info {
    flex: 1;
}

.stat-value {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #303133;
}

.stat-label {
    font-size: 14px;
    color: #909399;
}

/* 内容区域 */
.content-container {
    margin-bottom: 20px;
}

.chart-card {
    height: 400px;
}

.chart-container {
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chart-placeholder {
    width: 100%;
    height: 100%;
    background-color: #f5f7fa;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #909399;
    font-size: 16px;
}

.recent-card {
    height: 400px;
}

.article-list {
    height: 320px;
    overflow-y: auto;
}

.article-item {
    padding: 12px 0;
    border-bottom: 1px solid #ebeef5;
}

.article-item:last-child {
    border-bottom: none;
}

.article-title {
    font-size: 14px;
    color: #303133;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.article-date {
    font-size: 12px;
    color: #909399;
}

/* 底部区域 */
.bottom-container {
    margin-bottom: 20px;
}

.system-info-card {
    height: 220px;
}

.system-info {
    padding: 10px 0;
}

.info-item {
    margin-bottom: 15px;
    display: flex;
}

.info-label {
    width: 80px;
    color: #606266;
}

.info-value {
    color: #303133;
}

.quick-actions-card {
    height: 220px;
}

.quick-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.quick-actions .el-button {
    margin: 0;
    flex: 1 1 calc(50% - 15px);
    min-width: 120px;
    justify-content: center;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>