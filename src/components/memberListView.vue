<template>
  <div class="member-handle">
    <div class="member-item" :class="{'canclear': needClear}" v-for="(m, index) in userList" :key="index">
      <div class="el-icon-error clear" @click="clear(index)"></div>
      <memberView :id="m.id" :name="m.name" :avatar="m.avatar" :showName="true"></memberView>
    </div>
    <div class="member-item" v-if="needAdd > 0 && idList.length < needAdd">
      <div class="member-add" @click="addMember()">
        <i class="el-icon-plus"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import memberView from '@/components/memberView'
  import { getUserListInfo } from '@/api/user'

  export default {
    name: 'memberListView',
    props: ['doneUserList', 'needClear', 'needAdd', 'getList'],
    data() {
      return {
        userList: [],
        idList: []
      }
    },
    components: {
      memberView
    },
    created() {
      this.getMsg()
    },
    methods: {
      getMsg() {
        let ids = []
        for(let i = 0; i < this.doneUserList.length; i ++) {
          this.idList.push(this.doneUserList[i].id)
          ids.push(this.doneUserList[i].id)
        }
        if(ids.length) {
          ids = ids.join(',')
          let arr = []
          getUserListInfo(ids).then(res => {
            if(res.result == 'success') {
              let list = res.data
              for(let l in list) {
                arr.push({
                  id: l,
                  name: list[l].name,
                  avatar: list[l].avatar,
                  days: 0
                })
              }
              for(let i = 0; i < arr.length; i ++) {
                for(let d = 0; d < this.doneUserList.length; d ++) {
                  if(arr[i].id == this.doneUserList[d].id) {
                    arr[i].days = this.doneUserList[d].days
                  }
                }
              }
              this.userList = [...arr]
            }
          }).catch(error => {
            console.log(error)
          })
        }

      },
      clear(index) {
        this.userList.splice(index, 1)
        this.idList.splice(index, 1)
        this.$emit('getList', this.userList)
        this.$emit('getAllMembers')
        this.$emit('setOther')
      },
      addMember() {
        const _this = this;
        DingTalkPC.biz.contact.choose({
          multiple: _this.needAdd === 1 ? false : true, //是否多选： true多选 false单选； 默认true
          users: _this.idList, //默认选中的用户列表，员工userid；成功回调中应包含该信息
          corpId: 'dingef35e6e78a61828f35c2f4657eb6378f', //企业id
          max: _this.needAdd, //人数限制，当multiple为true才生效，可选范围1-1500
          onSuccess: function(data) {
            // console.log(data)
            _this.userList = []
            _this.idList = []
            for(let i = 0; i < data.length; i ++) {
              _this.userList.push({
                name: data[i].name,
                avatar: data[i].avatar,
                id: data[i].emplId,
                days: 0
              })
              _this.idList.push(data[i].emplId)
            }
            _this.$emit('getList', _this.userList)
            _this.$emit('getAllMembers')
            _this.$emit('setOther', _this.userList)
          /* data结构
            [{
              "name": "张三", //姓名
              "avatar": "http://g.alicdn.com/avatar/zhangsan.png" //头像图片url，可能为空
              "emplId": '0573', //员工userid
            },
            ...
            ]
          */
          },
          onFail : function(err) {}
        });
      }
    },
    watch: {
      'userList'() {
        this.$emit('getList', this.userList)
      }
    }
  }
</script>

<style lang="less">
  .member-handle {
    &::after {
      content: '';
      clear: both;
      display: block;
    }
    .member-item {
      position: relative;
      float: left;
      margin-right: 40px;
      .clear {
        position: absolute;
        z-index: 1;
        right: -2px;
        top: 8px;
        cursor: pointer;
        transition: all 0.15s;
        opacity: 0;
        display: none;
        font-size: 16px;
      }
      &.canclear {
        &:hover {
          .clear {
            opacity: 1;
          }
        }
        .clear {
          display: block;
        }
      }
      .member-add {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: #f6f6f6;
        margin-top: 10px;
        margin-bottom: 32px;
        cursor: pointer;
        i {
          font-size: 24px;
          color: #c1c3c4;
        }
      }
    }
  }
</style>
