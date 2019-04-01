<template>
  <el-upload
    class="upload-demo"
    action="https://upload.qiniup.com"
    :data="qiniuToken"
    :before-upload="beforeUpload"
    :on-change="upLoadFile"
    :file-list="fileList"
    :on-success="uploadSuccess"
    :on-error="uploadSuccess"
    :on-remove="removeFile">
    <el-button size="small" type="text">{{ text }}</el-button>
    <span class="grey" v-show="type === 'stage'">（须由业主确认过）</span>
  </el-upload>
</template>

<script>
  import { getToken, getQnToken, setQnToken } from '@/api/qiniu'

  export default {
    name: 'uploadFile',
    props: ['files', 'type', 'index'],
    data() {
      return {
        qiniuToken: {
          token: '',
          key: ''
        },
        tempUrl: 'http://image.arctron.cn/',
        fileList: [],
        text: this.type === 'stage' ? '上传成果' : '添加附件'
      }
    },
    mounted() {
      this.fileList = [...this.files]
    },
    watch: {
      "files"(val) {
        this.fileList = [...this.files]
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
          this.$message.error('上传图片只能是 JPG/PNG 格式!')
          return false
        }
        if(this.fileList.length >= 9) {
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
      removeFile(file, fileList) {
        // console.log(fileList)
        this.fileList = []
        for(let i = 0; i < fileList.length; i ++) {
          this.fileList.push({
            name: fileList[i].name,
            url: fileList[i].url
          })
        }
        this.$emit('addFiles', this.fileList, this.index)
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

