import { ElMessage} from "element-plus";

// 消息框
export function message(type,msg){
    ElMessage({
        type:type,//success，error，info，warning
        message:msg,
        showClose:true,
        duration:3000,
    })
}