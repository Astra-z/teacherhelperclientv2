<template>
  <div>lll</div>
</template>

<script>
    export default {
        name: "jumpinfo",
        data(){
          return{
            user:{}
          }
        },
        created(){
          let user=JSON.parse(sessionStorage.getItem('user'))
          this.$router.push({
            name:'studentinfo',
            params:{
              studentId: user.userId
            }
          })
        },
        methods:{

        }
    }
</script>

<style scoped>

</style>
