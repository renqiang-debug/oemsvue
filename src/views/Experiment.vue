<template>
<div class="main">
  <div class="title">
    <h1>{{experiment.eName}}</h1>
  </div>
  <div class="message" style="font-size: small;">
    <span>截止日期:{{experiment.deadline}} 所属学院:{{experiment.school}} 实验难度:{{experiment.degree === 1 ? '简单': experiment.degree === 2 ? '中等' : '困难'}}</span>
  </div>
  <div class="body">
    <div>
      <h3>实验介绍</h3>
      <p>
        {{experiment.shortcut === "" ? '老师没有填写实验简介' : experiment.shortcut}}
      </p>
    </div>
    <div>
      <h3>实验需求</h3>
      <p>
        {{experiment.requirement === "" ? '老师没有填写实验需求' : experiment.requirement}}
      </p>
    </div>
    <div>
      <h3>指导文件</h3>
      <p>
        <el-button type="primary" @click="handleDownload">点击下载指导文件</el-button>
      </p>
    </div>
    <div>
      <h3>提交实验报告</h3>
      <el-upload
          drag
          action="http://localhost:9999/oems/file/upload"
          :multiple="false"
          :limit="1"
      :on-success="handleFileSuccess">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">请在截止日期之前提交，以最后一次上传为准</div>
      </el-upload>
    </div>
  </div>
</div>
</template>

<script>
import axios from "axios";

export default {
  name: "Experiment",
  data() {
    return {
      experiment: {}
    }
  },
  methods: {
    handleFileSuccess(response) {
      // console.log(response);
      let uID = parseInt(localStorage.getItem("uID"))
      let postData = {
        uID: uID,
        eID: this.experiment.eID,
        path: response
      }
      axios({
        method: 'post',
        url: 'http://localhost:9999/oems/submitDoc',
        data: postData
      })
    },
    handleDownload() {
      window.location.href = "http://localhost:9999/oems/file/download?eDoc=" + this.experiment.guidDoc
    }
  },
  beforeMount() {
    // console.log(this.$route.params)
    let eID = parseInt(this.$route.params.eID)
    let postData = {eID: eID}
    axios({
      method: 'post',
      url: 'http://localhost:9999/oems/getExperiment',
      data: postData
    }).then(response => {
      // console.log(response)
      this.experiment = response.data
    })
  }
}
</script>

<style scoped>
.main {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.main .title {
  width: 1200px;
  text-align: center;
  margin-top: 10px;
}

.main .message {
  width: 1200px;
  text-align: center;
  margin-top: 10px;
}

.main .body {
  width: 1200px;
}

.main .body div {
  margin-top: 10px;
  margin-bottom: 10px;

}

p {
  margin: 10px 0 10px;
}
</style>