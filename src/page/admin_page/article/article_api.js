import axios from "@/config/axios_config";

export async function add_article(ArticleDTO){
    const response = await axios.post("/admin/article",ArticleDTO,{
        headers:{
            'Content-Type':'application/json'
        }
    });
    return response;
}

export async function page_query_article(ArticlePageQueryDTO){
    const response = await axios.get('/admin/article/page',{
        params:{
          'articleName':ArticlePageQueryDTO.articleName,
          'tagIds':ArticlePageQueryDTO.tagIds,
          'page':ArticlePageQueryDTO.page,
          'pageSize':ArticlePageQueryDTO.pageSize,
          'categoryId':ArticlePageQueryDTO.categoryId,
        }
    });
    return response;
}

export async function select_allCategory() {
    const response = await axios.get('/admin/category/select');
    return response;
}

export async function select_allTag() {
    const response = await axios.get('/admin/tag/select');
    return response;
}

export async function update_article_status(id, status) {
    const response = await axios.post(`/admin/article/${id}`, null, {
        params: {
            status: status
        }
    });
    return response;
}

export async function update_article(article) {
    const response = await axios.put("/admin/article", article, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

export async function delete_article(id) {
    const response = await axios.delete(`/admin/article/${id}`);
    return response;
}