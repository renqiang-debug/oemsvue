<template>
 <div class="main">
   <h2>创建实验</h2>
   <el-form :model="createExperiment" :rules="eRules" ref="createExperiment" label-position="left">
     <el-form-item label="实验名称" prop="eName">
       <el-input auto-complete="off" v-model="createExperiment.eName"></el-input>
     </el-form-item>
     <el-form-item label="实验简介" prop="shortcut">
       <el-input type="textarea" auto-complete="off" v-model="createExperiment.shortcut"></el-input>
     </el-form-item>
     <el-form-item label="所属学院" prop="school">
       <el-input auto-complete="off" v-model="createExperiment.school"></el-input>
     </el-form-item>
     <el-form-item label="实验难度" prop="degree">
       <el-select v-model="createExperiment.degree" placeholder="请选择" style="width: 100%;">
         <el-option label="简单" value="1"></el-option>
         <el-option label="中等" value="2"></el-option>
         <el-option label="困难" value="3"></el-option>
       </el-select>
     </el-form-item>
     <el-form-item label="截止日期" prop="deadline" style="width: 100%;">
       <el-date-picker
           v-model="createExperiment.deadline"
           type="date"
           placeholder="选择日期"
           value-format="yyyy-MM-dd"
           :clearable="false">
       </el-date-picker>
     </el-form-item>
     <el-form-item label="实验需求" prop="requirement">
       <el-input type="textarea" auto-complete="off" v-model="createExperiment.requirement"></el-input>
     </el-form-item>
     <el-form-item label="指导文件" prop="guidDoc">
       <el-upload
           drag
           action="http://localhost:9999/oems/file/upload"
           :multiple="false"
           :limit="1"
           :on-success="handleFileSuccess">
         <i class="el-icon-upload"></i>
         <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
         <div class="el-upload__tip" slot="tip">以最后一次上传为准</div>
       </el-upload>
     </el-form-item>
   </el-form>
   <el-button type="primary" @click="handleCreateExperiment">创建实验</el-button>
 </div>
</template>

<script>

import axios from "axios";

export default {
name: "CreateExperiment",
  data() {
    return {
      createExperiment: {
        eName: '',
        shortcut: '',
        school: '',
        degree: '',
        deadline: new Date(),
        requirement: '',
        guidDoc: ''
      },
      eRules: {
        eName: [{required: true, message: '请填写此项', trigger: 'blur'}],
        shortcut: [{required: true, message: '请填写此项', trigger: 'blur'}],
        school: [{required: true, message: '请填写此项', trigger: 'blur'}],
        degree: [{required: true, message: '请填写此项', trigger: 'blur'}],
        deadline: [{required: true, message: '请填写此项', trigger: 'blur'}],
        requirement: [{required: true, message: '请填写此项', trigger: 'blur'}],
        guidDoc: [{required: true, message: '请填写此项', trigger: 'blur'}]
      }
    }
  },
  methods: {
    handleFileSuccess(response) {
      // console.log(response);
      this.createExperiment.guidDoc = response
    },
    handleCreateExperiment() {
      this.$refs['createExperiment'].validate((valid) => {
        if (valid) {
          console.log(this.createExperiment)
          let postData = {
            createID: parseInt(localStorage.getItem('uID')),
            eName: this.createExperiment.eName,
            shortcut: this.createExperiment.shortcut,
            school: this.createExperiment.school,
            degree: this.createExperiment.degree,
            deadline: this.createExperiment.deadline,
            requirement: this.createExperiment.requirement,
            guidDoc: this.createExperiment.guidDoc
          }
          axios({
            method: 'post',
            url: 'http://localhost:9999/oems/createExperiment',
            data: postData
          }).then(() => {
            this.$router.replace({name: 'teacher-home'})
          })
        } else {
          console.log('error submit!!')
        }
      });
    }
  }
}
</script>

<style scoped>
.main {
  width: 700px;
  margin: 0 auto;
}
</style>