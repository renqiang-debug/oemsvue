<template>
  <div id="teacher-home">
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
      <div class="head-area">
        <el-select v-model="value" placeholder="请选择实验" @change="handleOption">
          <el-option
              v-for="item in options"
              :key="item.eID"
              :label="item.eName"
              :value="item.eID">
          </el-option>
        </el-select>
        <el-button type="primary" @click="handleCreate">创建实验</el-button>
      </div>
      <div class="body-area">
        <el-table
            :data="tableData"
            border
            style="width: 100%">
          <el-table-column
              fixed
              type="index"
              label="序号"
              width="50">
          </el-table-column>
          <el-table-column
              prop="username"
              label="姓名">
          </el-table-column>
          <el-table-column
              prop="eDoc"
              label="是否提交实验报告"
              width="200">
            <template slot-scope="scope">
              {{scope.row.eDoc === '' ? '否' : '是'}}
            </template>
          </el-table-column>
          <el-table-column
              prop="score"
              label="成绩"
              width="200">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.score" controls-position="right" :min="0" :max="100"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              width="200">
            <template slot-scope="scope">
              <el-button @click="handleExport(scope.row)" type="text" size="small">导出实验报告</el-button>
              <el-button @click="editScore(scope.row)" type="text" size="small" slot="reference">提交成绩</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 10px">
        <download-excel
            :data   = "tableData"
            :fields = "json_fields"
            type    = "xls"
            name    = "学生成绩.xls">
          <el-button type="primary">导出成绩</el-button>
        </download-excel>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TeacherHome",
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
      options: [],
      value: '',
      tableData: [],
      json_fields: {
        '学生姓名': 'username',
        '成绩': 'score'
      }
    }
  },
  beforeMount() {
    this.username = localStorage.getItem("username");
    let uID = localStorage.getItem("uID")
    axios({
      method: 'post',
      url: 'http://localhost:9999/oems/getTeacherExperiment',
      data: {createID: uID}
    }).then(response => {
      // console.log(response)
      this.options = response.data
    })
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
    handleOption(value) {
      // console.log(value)
      let eID = parseInt(value)
      axios({
        method: 'post',
        url: 'http://localhost:9999/oems/getExperimentStudents',
        data: {eID: eID}
      }).then(response => {
        // console.log(response)
        this.tableData = response.data
      })
    },
    handleExport(param) {
      // console.log(param)
      window.location.href = "http://localhost:9999/oems/file/download?eDoc=" + param.eDoc
    },
    editScore(param) {
      console.log(param)
      let eID = parseInt(this.value)
      let postData = {
        eID: eID,
        uID: param.uID,
        score: param.score
      }
      axios({
        method: 'post',
        url: 'http://localhost:9999/oems/editScore',
        data: postData
      }).then(() => {
        this.$message.success("提交成功")
      }).catch(() => {
        this.$message.error('提交失败，请再试一次')
      })
    },
    handleCreate() {
      this.$router.push({name: 'create-experiment'})
    }
  }
}
</script>

<style scoped>
#teacher-home {
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

.main .head-area {
  width: 1200px;
  display: flex;
  justify-content: space-between;
}

.main .body-area {
  margin-top: 10px;
}
</style>