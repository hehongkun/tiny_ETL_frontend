<template>
  <div class="login-box">
    <!-- 通过:rules="loginFormRules"来绑定输入内容的校验规则 -->
    <el-form :rules="loginFormRules"
             ref="loginForm"
             :model="loginForm"
             label-position="right"
             label-width="auto"
             show-message>
      <span class="login-title">tiny ETL</span>
      <div style="margin-top: 5px"></div>
      <el-form-item label="用户名"
                    prop="loginName">
        <el-col :span="22">
          <el-input type="text"
                    v-model="loginForm.loginName"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="密码"
                    prop="loginPassword">
        <el-col :span="22">
          <el-input type="password"
                    v-model="loginForm.loginPassword"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <el-button type="primary"
               @click="loginSubmit('loginForm')">登录</el-button>
  </div>
</template>
<script>
import { postAction } from '@/api/manage'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        loginName: '',
        loginPassword: ''
      },
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      loginFormRules: {
        loginName: [
          { required: true, message: '账号不可为空', trigger: 'blur' }
        ],
        loginPassword: [
          { required: true, message: '密码不可为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginSubmit (formName) {
      // 为表单绑定验证功能
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var params = {
            'username': this.loginForm.loginName,
            'password': this.loginForm.loginPassword
          }
          postAction('/user/login', params).then((res) => {
            if (res.data.success) {
              // 登录成功，跳转页面
              console.log(res)
              localStorage.setItem('token', res.data.token)
              localStorage.setItem('userId', res.data.user.Id)
              this.$router.push('panel')
            } else {
              this.$message.error(res.data.data)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.login-box {
  border: 1px solid #dcdfe6;
  width: 350px;
  margin: 15% auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px rgb(108, 157, 204);
}
.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #a2caf0;
  font-size: 30px;
  font-weight: bold;
}
</style>
