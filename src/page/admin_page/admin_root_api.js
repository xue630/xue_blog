import axios from '@/config/axios_config'


export async function logout(){
    const response = await axios.post('/admin/user/logout',null,
    {
        headers:{
            "Content-Type":'application/json'
        }
    });
    return response;
}