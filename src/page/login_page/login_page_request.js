
import axios from "@/config/axios_config";

// const url='http://localhost:8080';
export async function  login(data){
    
    const response = await axios.post('/admin/user/login',data,{
        headers:{
            "Content-Type":'application/json'
        }
    });
    return response;
}

export async function logout(token){
    const response = await axios.post(url+'user/logout',null,{
        headers:{
            "Content-Type":'application/json',
            "Authorization":token
        }
    });
    return response;
}