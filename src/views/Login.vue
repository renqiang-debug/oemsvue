<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">开放性实验辅助管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="80px" class="ms-content" label-position="left">
        <el-form-item prop="username" label="用户名：" class="form-label">
          <el-input v-model="param.username" placeholder="username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码：" class="form-label">
          <el-input type="password" placeholder="password" v-model="param.password"></el-input>
        </el-form-item>
        <el-form-item prop="identity" label="身份：" class="form-label">
          <el-select v-model="param.identity" placeholder="请选择身份">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <p class="login-tips">Tips : 初始密码为学号/工号后六位。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function () {
    return {
      param: {
        username: '',
        password: '',
        identity: '',
      },
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'},
          { min: 12, max: 12, message: '学号/工号长度为12个字符', trigger: 'blur' }],
        password: [{required: true, message: '请输入密码', trigger: 'blur'},
          { min: 6, max: 16, message: '密码在6-16位', trigger: 'blur' }],
        identity: [{required: true, message: '请选择身份', trigger: 'blur'}],
      },
      options: [
        {
          value: '1',
          label: '学生'
        },
        {
          value: '2',
          label: '教师'
        },
        {
          value: '3',
          label: '机房管理'
        }
      ]
    };
  },
  beforeCreate() {
    if (localStorage.getItem('uID') !== null) {
      let identity = parseInt(localStorage.getItem('identity'))
      switch (identity) {
        case 1:
          this.$router.push({name: "student-home"});
          break;
        case 2:
          this.$router.push({name: "teacher-home"});
          break;
        case 3:
          this.$router.push({name: "manager-home"});
          break;
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.login.validate(valid => {
        if (valid) {
          // localStorage.setItem('username', this.param.username);
          // console.log(this.param);
          // this.$router.push({name: 'student-home'});
          let postData = this.param;
          axios.defaults.withCredentials = true;
          axios({
            method: 'post',
            url: 'http://localhost:9999/oems/login',
            data: postData
          }).then(response => {
            console.log(response);
            localStorage.setItem("uID", response.data.uID)
            localStorage.setItem("username", response.data.username)
            localStorage.setItem("identity", response.data.identity)
            if (response.data !== "") {
              switch (response.data.identity) {
                case 1:
                  this.$router.push({name: "student-home"});
                  break;
                case 2:
                  this.$router.push({name: "teacher-home"});
                  break;
                case 3:
                  this.$router.push({name: "manager-home"});
                  break;
              }
            }
            else
              this.$message.error('请检查登录信息');
          });
        } else {
          this.$message.error('请检查登录信息');
          console.log('error submit!!');
        }
      });
    },
  },
};
</script>

<style>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/images/bg-img.jpg);
  background-size: 100%;
}

.ms-title {
  width: 100%;
  line-height: 70px;
  text-align: center;
  font-size: 25px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #C0C4CC;
}

.form-label .el-form-item__label {
  color: #f6faff;
}
</style>