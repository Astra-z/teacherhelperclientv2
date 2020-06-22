<template>
<el-card>
  <h2>天气</h2>
  <p>日期：{{"      "+"今天"}}</p>
  <p>风向：{{"      "+this.weatherlist[0].fengxiang}}</p>
  <p>最高温：{{"      "+this.weatherlist[0].high}}</p>
  <p>最低温：{{this.weatherlist[0].low}}</p>
  <p>天气：{{this.weatherlist[0].type}}</p>
  <br>
  <br>
  <p>日期：{{"      "+"明天"}}</p>
  <p>风向：{{"      "+this.weatherlist[1].fengxiang}}</p>
  <p>最高温：{{"      "+this.weatherlist[1].high}}</p>
  <p>最低温：{{this.weatherlist[1].low}}</p>
  <p>天气：{{this.weatherlist[1].type}}</p>
</el-card>


</template>

<script>
    import axios from 'axios'
    export default {
        name: "weather",
      name: "jumpinfo",
      data(){
        return{
          weatherlist:[],
          user:{},
        }
      },
      created(){
        let city='上海'
        axios.get(`http://wthrcdn.etouch.cn/weather_mini?city=${city}`)
          .then((response)=>{
            console.log(response.data.data.forecast)
            this.weatherlist=response.data.data.forecast;
          })
          .catch(function(err){
            alert("城市输入错误")
          })
      },
      methods:{

      }
    }
</script>


<style scoped>

</style>
