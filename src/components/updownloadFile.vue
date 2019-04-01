<template>
  <div class="up-down-load">
    <el-upload
      class="upload-demo"
      action="https://upload.qiniup.com"
      :data="qiniuToken"
      :before-upload="beforeUpload"
      :on-change="upLoadFile"
      :on-success="uploadSuccess"
      :on-error="uploadSuccess"
      :show-file-list="false"
      v-show="showBtn">
      <el-button size="small" type="text">{{ text }}</el-button>
      <span class="grey" v-show="type === 'stage'">（须由业主确认过）</span>
    </el-upload>
    <ul class="el-upload-list el-upload-list--text">
      <li :tabindex="index" class="el-upload-list__item is-success" v-for="(f, index) in fileList" :key="index">
        <a class="el-upload-list__item-name" :href="f.url" :download="f.name"><i class="el-icon-document"></i>{{ f.name }}</a>
        <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-circle-check"></i></label>
        <i class="el-icon-close" @click="showBtn && removeFile(index)"></i><i class="el-icon-close-tip">按 delete 键可删除</i>
      </li>
    </ul>
  </div>
</template>

<script>
  import { getToken, getQnToken, setQnToken } from '@/api/qiniu'

  export default {
    name: 'updownloadFile',
    props: ['files', 'type', 'index', 'canup'],
    data() {
      return {
        qiniuToken: {
          token: '',
          key: ''
        },
        tempUrl: 'http://image.arctron.cn/',
        fileList: [],
        text: this.type ? (this.type === 'stage' ? '上传成果' : '添加附件') : '',
        showBtn: true
      }
    },
    mounted() {
      this.fileList = [...this.files]
      if(this.canup === 'n') {
        this.showBtn = false
      }else {
        this.showBtn = true
      }
    },
    watch: {
      "files"(val) {
        this.fileList = [...this.files]
        if(this.canup === 'n') {
          this.showBtn = false
        }else {
          this.showBtn = true
        }
      }
    },
    methods: {
      upLoadFile(file, fileList) {
        // console.log(fileList)
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
          return false
        }
        if(this.fileList.length >= 9 && this.type !== 'stage' && this.type !== 'over') {
          this.$message.error('上传最多支持9张图片!')
          return false
        }
        let typestr = ''
        if(isJPG) {
          typestr = '.jpg'
        }else {
          typestr = '.png'
        }
        const _this = this
        let Num = ""
        for(let i = 0; i < 6; i++) {
          Num += Math.floor(Math.random() * 10)
        }
        let key = new Date().getTime() + Num + typestr
        _this.qiniuToken.key = key
        const qnToken = getQnToken()
        if(qnToken) {
          _this.qiniuToken.token = qnToken
        }else {
          return new Promise((resolve, reject) => {
            getToken().then(response => {
              // console.log(response)
              const token = response.data.uploadToken
              _this.qiniuToken.token = token
              setQnToken(token)
              resolve(true)
            }).catch(err => {
              console.log(err)
              reject(false)
            })
          })
        }
      },
      uploadSuccess(response, file, fileList) {
        // console.log(this.fileList)
        this.fileList.push({
          name: file.name,
          url: this.tempUrl+file.response.key
        })
        this.$emit('addFiles', this.fileList, this.index)
      },
      removeFile(index) {
        // console.log(fileList)
        this.fileList.splice(index, 1)
        this.$emit('addFiles', this.fileList, this.index, 'remove')
      }
    }
  }
</script>

<style lang="less">
.grey {
  color: #b8b8b8;
  font-size: 12px;
}
</style>

