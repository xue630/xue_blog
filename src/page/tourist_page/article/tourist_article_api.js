import axios from "@/config/axios_config";

export async function tourist_get_article_list(ArticleListDTO) {
    const response = await axios.get('/tourist/article',{
        params:{
            'articleName':ArticleListDTO.articleName,
            'tagIds':ArticleListDTO.tagIds,
            'categoryId':ArticleListDTO.categoryId
        }
    });
    return response;
}


export async function tourist_get_all_category() {
    const response = await axios.get('/tourist/category/select');
    return response;
}

export async function tourist_get_all_tag() {
    const response = await axios.get('/tourist/tag/select');
    return response;

}