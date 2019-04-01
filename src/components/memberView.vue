<template>
<transition name="fade-transform" mode="out-in">
  <div class="member-view">
    <div class="image">
      <img :src="img" alt="" width="50" v-if="img">
      <span v-else>{{ username | cutName }}</span>
    </div>
    <div class="name" v-if="username" v-show="showName"><span>{{ username }}</span></div>
  </div>
</transition>
</template>

<script>
  import { getUserInfo } from '@/api/user'

  export default {
    name: 'memberView',
    props: ['id', 'name', 'avatar', 'showName', 'index'],
    data() {
      return {
        img: this.avatar,
        username: this.name
      }
    },
    created() {
      this.getInfo()
    },
    methods: {
      getInfo() {
        if(!this.name) {
          getUserInfo(this.id).then(res => {
            // console.log(res)
            const data = res.data
            this.img = data.avatar
            this.username = data.name
            this.$emit('getName', this.username, this.index)
          })
        }else {
          this.img = this.avatar
          this.username = this.name
        }
      }
    },
    filters: {
      cutName(name) {
        let str = name;
        if(str) {
          if(str.length > 2) {
            str = str.slice(str.length - 2)
          }
        }
        return str;
      }
    },
    watch: {
      'id'(val) {
        this.getInfo()
      }
    }
  }
</script>

<style lang="less">
  .member-view {
    width: 50px;
    overflow: hidden;
    padding-top: 10px;
    .image {
      width: 50px;
      height: 50px;
      background-color: #3296fa;
      border-radius: 50%;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      span {
        color: #fff;
        font-size: 16px;
      }
    }
    .name {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      font-size: 12px;
      color: #222;
    }
  }
</style>
