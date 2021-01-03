<template>
  <div id="student-home">
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
      <el-tabs tab-position="left" @tab-click="handleTabClick">
        <el-tab-pane label="实验列表">
          <el-table
              :data="eData"
              border
              style="width: 100%">
            <el-table-column
                fixed
                type="index"
                label="序号"
                width="50">
            </el-table-column>
            <el-table-column
                prop="eName"
                label="实验名称">
            </el-table-column>
            <el-table-column
                prop="school"
                label="所属学院"
                width="200">
            </el-table-column>
            <el-table-column
                prop="degree"
                label="实验难度"
                width="100">
            </el-table-column>
            <el-table-column
                prop="deadline"
                label="截止日期"
                width="150">
            </el-table-column>
            <el-table-column
                label="操作"
                width="150">
              <template slot-scope="scope">
                <el-button @click="handleChoose(scope.row)" type="text" size="small">报名</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px;">
            <el-pagination
                background
                hide-on-single-page
                layout="prev, pager, next"
                :total="total"
                :page-size="10"
                :current-page="curPage"
                @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的实验"><el-table
            :data="myData"
            border
            style="width: 100%">
          <el-table-column
              fixed
              type="index"
              label="序号"
              width="50">
          </el-table-column>
          <el-table-column
              prop="eName"
              label="实验名称">
          </el-table-column>
          <el-table-column
              prop="school"
              label="所属学院"
              width="300">
          </el-table-column>
          <el-table-column
              prop="deadline"
              label="截止日期"
              width="150">
          </el-table-column>
          <el-table-column
              label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button @click="handleDetail(scope.row)" type="text" size="small">进入实验</el-button>
            </template>
          </el-table-column>
        </el-table>
          </el-tab-pane>
        <el-tab-pane label="查看成绩"><el-table
            :data="myScore"
            border
            style="width: 100%">
          <el-table-column
              fixed
              type="index"
              label="序号"
              width="50">
          </el-table-column>
          <el-table-column
              prop="eName"
              label="实验名称">
          </el-table-column>
          <el-table-column
              prop="score"
              label="成绩"
              width="150">
          </el-table-column>
        </el-table>
          </el-tab-pane>
        <el-tab-pane label="查询机房">
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
          <div style="margin-top: 30px;">
            <div style="display: inline-block;margin: 0 20px 0;" v-for="(item, index) in findRes" v-bind:key="index">{{item}}</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "StudentHome",
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
      eData: [],
      total: 100,
      curPage: 0,
      myData: [],
      myScore: [],
      findLabData: {
        date: new Date(),
        mclass: '1'
      },
      findRes: [],
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
      }
    }
  },
  beforeCreate() {
    if (localStorage.getItem("uID") === null)
      this.$router.replace({name: "login"});
  },
  beforeMount() {
    this.username = localStorage.getItem("username");
    axios({
      method: 'get',
      url: 'http://localhost:9999/oems/getExperimentNum'
    }).then(response => {
      // console.log(response);
      this.total = response.data;
      let postData = {currentPage: 1};
      axios({
        method: 'post',
        url: 'http://localhost:9999/oems/getExperimentList',
        data: postData
      }).then(response => {
        this.eData = response.data;
      });
    });
  },
  methods: {
    handleExit() {
      localStorage.clear()
      this.$router.go(0)
    },
    handleChoose(param) {
      console.log(param);
      let uID = localStorage.getItem("uID");
      let postData = {uID: uID, eID: param.eID}
      axios({
        method: 'post',
        url: 'http://localhost:9999/oems/apply',
        data: postData
      }).then(response => {
        if (response.data === 1) {
          this.$message.error("你已经报名过了");
        }
        if (response.data === 2) {
          this.$message.error("该实验人数已满");
        }
        if (response.data === 3) {
          this.$message.error("最多只能报名10个实验");
        }
        if (response.data === 4) {
          this.$message.success("报名成功");
        }
      });
    },
    handleCurrentChange(cur) {
      let postData = {currentPage: parseInt(cur)};
      axios({
        method: 'post',
        url: 'http://localhost:9999/oems/getExperimentList',
        data: postData
      }).then(response => {
        this.eData = response.data;
      });
    },
    findLab() {
      axios({
        method: 'post',
        url: 'http://localhost:9999/oems/findLab',
        data: this.findLabData
      }).then(response => {
        // console.log(response)
        this.findRes = response.data;
      });
    },
    handleDetail(param) {
      let deadline = new Date(param.deadline)
      // console.log(deadline)
      let now = new Date();
      if (now > deadline) {
        this.$message.error("已经超过截止时间")
        return;
      }
      this.$router.push({name: 'student-experiment', params: {eID: param.eID}})
    },
    handleTabClick() {
      let uID = parseInt(localStorage.getItem('uID'))
      axios({
        method: 'post',
        url: 'http://localhost:9999/oems/getMyExperiment',
        data: {uID: uID}
      }).then(response => {
        // console.log(response)
        this.myData = response.data
      })
      axios({
        method: 'post',
        url: 'http://localhost:9999/oems/getMySorce',
        data: {uID: uID}
      }).then(response => {
        // console.log(response)
        this.myScore = response.data
      })
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

    }
  }
}
</script>

<style scoped>
#student-home {
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

span {
  font-size: 14px;
  font-weight: 500;
}

.main {
  width: 1200px;
  border-top: solid 1px #DCDFE6;
  padding-top: 30px;
}
</style>