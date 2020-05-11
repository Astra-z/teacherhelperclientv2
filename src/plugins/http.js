import axios from 'axios'
const MyHttpPlugin={}

MyHttpPlugin.install = (Vue)=>{

  axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
  // 4. 添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpPlugin;
