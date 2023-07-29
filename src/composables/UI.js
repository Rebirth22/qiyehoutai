// ElementPlus组件，消息警示框 用于登录或者报错提醒
import { ElNotification } from 'element-plus'
const notification = (message, type = 'success', dangerouslyUseHTMLString = false) => {
    ElNotification({
        message,
        type,
        dangerouslyUseHTMLString,
        duration: 2000,
    })
}


// 退出提示框
import { ElMessageBox } from 'element-plus'
const comfirmbox = (content = "提示内容", type = "warning", title = "") => {
    return ElMessageBox.confirm(
        content,
        title,
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type,
        }
    )
}

// 显示全屏loading功能
import nprogress from "nprogress";
//显示全屏loading 
const showLoading = () => {
    nprogress.start();
};
// 隐藏全局loading
const hideLoading = () => {
    nprogress.done();
};



export {
    notification,
    comfirmbox,
    showLoading,
    hideLoading
};
