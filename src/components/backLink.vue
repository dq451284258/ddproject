<template>
  <div class="back-link">
    <div class="back-link-handle" @click="go">
      <i class="el-icon-back"></i><span class="icon-back">返回</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'backLink',
    props: ['url'],
    methods: {
      go() {
        if(this.url) {
          this.$router.push(this.url)
        }else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

<style lang="less">
  .back-link {
    .back-link-handle {
      padding: 15px 0 15px 20px;
      cursor: pointer;
      position: relative;
      &::after {
        content: '';
        height: 1px;
        background: #e6e5e6;
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
      }
      span.icon-back {
        color: #565656;
        font-size: 14px;
        display: inline-block;
        line-height: 20px;
      }
      .el-icon-back {
        font-size: 14px;
        margin-right: 10px;
        border-radius: 50%;
        border: 1px solid #565656;
        padding: 2px;
      }
    }
  }
</style>
