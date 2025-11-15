import axios from "@/config/axios_config";

export async function page_query_category(CategoryPageQueryDTO) {
    const response = await axios.get('/admin/category/page', {
        params: {
            categoryName: CategoryPageQueryDTO.categoryName,
            page: CategoryPageQueryDTO.page,
            pageSize: CategoryPageQueryDTO.pageSize
        }
    });
    return response;
}

export async function update_category_status(status, id) {
    const response = await axios.post(`/admin/category/status/${status}`, null, {
        params: {
            id: id
        }
    });
    return response;
}

export async function update_category(categoryData) {
    const response = await axios.put("/admin/category", categoryData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

export async function delete_category(id) {
    const response = await axios.delete(`/admin/category/${id}`);
    return response;
}

export async function add_category(categoryDTO) {
    const response = await axios.post("/admin/category", categoryDTO, {
        headers:{
            "Content-Type":"application/json"
        }
    });
    return response;
}