import axios from "@/config/axios_config";

export async function auth() {
    const response = await axios.post('/admin/user/auth',null,{
        headers:{
            "Content-Type":'application/json'
        }
    })
    return response;
}
