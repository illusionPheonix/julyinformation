// 本地存储的localStorage 封装
export default {
    // 存数据
    save(key,val){
        window.localStorage.setItem(key,JSON.stringify(val));
    },
     // 取数据
     get(key){
        return JSON.parse(window.localStorage.getItem(key));
     },
    //  清除数据
    remove(key){
        window.localStorage.removeItem(key);
    }
}