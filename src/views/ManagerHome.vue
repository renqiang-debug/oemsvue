<template>
  <div id="manager-home">
    <div class="header">
      <div class="title">开放性实验辅助管理系统</div>
      <div class="message">欢迎您，{{ username }}。

        <el-button type="text" @click="dialogFormVisible = true" size="middle">修改密码</el-button>

        <el-dialog title="修改密码" :visible.sync="dialogFormVisible" @close="handleCancel">
          <el-form :model="modifyPassword" :rules="rules" ref="modifyPassword">
            <el-form-item label="旧密码" label-width="120px" prop="oldPassword">
              <el-input type="password" v-model="modifyPassword.oldPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" label-width="120px" prop="newPassword">
              <el-input type="password" v-model="modifyPassword.newPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" label-width="120px" prop="checkPassword">
              <el-input type="password" v-model="modifyPassword.checkPassword" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
          </div>
        </el-dialog>
        <el-button type="text" @click="handleExit" size="middle">退出登录</el-button>
      </div>
    </div>
    <div class="main">
      <div style="display: inline-block;">
        选择日期：
        <el-date-picker
            v-model="findLabData.date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :clearable="false">
        </el-date-picker>
      </div>
      <div style="display: inline-block;">
        第几大节：
        <el-select v-model="findLabData.mclass" placeholder="请选择">
          <el-option
              label="第一大节"
              value="1"
          >
          </el-option>
          <el-option
              label="第二大节"
              value="2">
          </el-option>
          <el-option
              label="第三大节"
              value="3">
          </el-option>
          <el-option
              label="第四大节"
              value="4">
          </el-option>
          <el-option
              label="第五大节"
              value="5">
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" style="margin-left: 30px;" @click="findLab">点击查询</el-button>
      <div style="margin-top: 30px;">查询结果：</div>
      <el-table
          :data="findRes"
          border
          style="width: 100%">
        <el-table-column
            fixed
            type="index"
            label="序号"
            width="50">
        </el-table-column>
        <el-table-column
            prop="mid"
            label="机房">
        </el-table-column>

        <el-table-column
            prop="state"
            label="编辑状态"
            width="200">
          <template slot-scope="scope">
            <el-select v-model="scope.row.state" placeholder="请选择">
              <el-option label="空闲" value="1"></el-option>
              <el-option label="占用" value="2"></el-option>
              <el-option label="未开放" value="3"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small" slot="reference">提交修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ManagerHome",
  data() {
    let validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'));
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error('密码长度在6到16位之间'));
      } else {
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error('密码长度在6到16位之间'));
      } else {
        callback();
      }
    };
    let validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认新密码'));
      } else if (value !== this.modifyPassword.newPassword) {
        callback(new Error('两次输入密码不一致！'));
      } else {
        callback();
      }
    };
    return {
      username: '测试者',
      modifyPassword: {
        oldPassword: '',
        newPassword: '',
        checkPassword: ''
      },
      dialogFormVisible: false,
      rules: {
        oldPassword: [
          { validator: validatePass1, trigger: 'blur' }
        ],
        newPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePass3, trigger: 'blur' }
        ]
      },
      findLabData: {
        date: new Date(),
        mclass: '1'
      },
      findRes: []
    }
  },
  beforeMount() {
    this.username = localStorage.getItem("username");
  },
  beforeCreate() {
    if (localStorage.getItem("uID") === null)
      this.$router.replace({name: "login"});
  },
  methods: {
    handleExit() {
      localStorage.clear()
      this.$router.go(0)
    },
    handleCancel() {
      this.dialogFormVisible = false
      this.$refs['modifyPassword'].resetFields()
    },
    handleSubmit() {
      this.$refs['modifyPassword'].validate((valid) => {
        if (valid) {
          let postData = {
            uID: parseInt(localStorage.getItem('uID')),
            oldPassword: this.modifyPassword.oldPassword,
            newPassword: this.modifyPassword.newPassword
          }
          axios({
            method: 'post',
            url: 'http://localhost:9999/oems/modify',
            data: postData
          }).then(response => {
            if (response.data === true) {
              this.dialogFormVisible = false
              this.$refs['modifyPassword'].resetFields()
              this.$message.success("修改成功");
              localStorage.clear()
              this.$router.go(0)
            }
            else {
              this.$refs['modifyPassword'].resetFields()
              this.$message.error("修改失败，请检查您的信息");
            }
          })
        } else {
          console.log('error submit!!');
        }
      });
    },
    findLab() {
      axios({
        method: 'post',
        url: 'http://localhost:9999/oems/findLabForManager',
        data: this.findLabData
      }).then(response => {
        // console.log(response.data)
        this.findRes = response.data;
        this.findRes.forEach(item => {
          item.state = item.state.toString()
        })
      });
    },
    edit(param) {
      // console.log(param)
      let postData = {
        mid: param.mid,
        mtime: param.mtime,
        mclass: param.mclass,
        state: param.state
      }
      axios({
        method: 'post',
        url: 'http://localhost:9999/oems/editLab',
        data: postData
      }).then(() => {
        this.$message.success("修改成功")
      }).catch(() => {
        this.$message.error("修改失败，请再试一次")
      })
    }
  }
}
</script>

<style scoped>
#manager-home {
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  color: #606266;
  width: 1200px;
}

.header {
  width: 1200px;
  height: 70px;
  /*background-color: #97a8be;*/
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header .title {
  font-size: 30px;
  color: #409EFF;
  line-height: 70px;

}

.header .message {
  margin-bottom: 10px;
}

.main {
  width: 1200px;
  border-top: solid 1px #DCDFE6;
  padding-top: 30px;
}
</style>