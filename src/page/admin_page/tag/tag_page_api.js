import axios from "@/config/axios_config";

export async function page_query_tag(TagPageQueryDTO) {
    const response = await axios.get('/admin/tag/page', {
        params: {
            tagName: TagPageQueryDTO.tagName,
            page: TagPageQueryDTO.page,
            pageSize: TagPageQueryDTO.pageSize
        }
    });
    return response;
}

export async function update_tag_status(status, id) {
    const response = await axios.post(`/admin/tag/status/${status}`, null, {
        params: {
            id: id
        }
    });
    return response;
}

export async function update_tag(tagData) {
    const response = await axios.put("/admin/tag", tagData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

export async function delete_tag(id) {
    const response = await axios.delete(`/admin/tag/${id}`);
    return response;
}

export async function add_tag(tagDTO) {
    const response = await axios.post("/admin/tag", tagDTO, {
        headers:{
            "Content-Type":"application/json"
        }
    });
    return response;
}