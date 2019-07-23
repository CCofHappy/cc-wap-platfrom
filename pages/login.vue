<template>
  <div>
    <van-cell-group>
      <van-field
        v-model="username"
        required
        clearable
        label="用户名"
        right-icon="question-o"
        placeholder="请输入用户名"
        @click-right-icon="$toast('question')"
      />

      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
      />
    </van-cell-group>
    <van-button type="primary" size="large" @click="handleSubmit"
      >登录</van-button
    >
  </div>
</template>

<script>
import { requseLogin } from '@/api'
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      const loginParams = {
        username: this.username,
        password: this.password
      }
      // 调用axios登录接口
      requseLogin(loginParams)
        .then(res => {
          // eslint-disable-next-line no-console
          console.log(res)
          // eslint-disable-next-line no-unused-vars
          const { code, msg, user } = res.data
          if (code === 200) {
          } else {
          }
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log(err)
        })
    }
  }
}
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
