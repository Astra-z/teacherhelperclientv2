import axios from 'axios'
const MyHttpPlugin={}

MyHttpPlugin.install = (Vue)=>{

  // axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
  axios.defaults.baseURL='/apis/v1/'
  //  添加实例方法
  Vue.prototype.$http=axios;
  //设置全局请求头
  axios.interceptors.request.use(
    config => {
// config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      let token =localStorage.getItem('Authorization')
      if (token) {
        config.headers.common['Authorization'] =localStorage.getItem('Authorization');
      }
      return config
    },
    err => {
      return Promise.reject(err);
    }
  )

}

export default MyHttpPlugin;
