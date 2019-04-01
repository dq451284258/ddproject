<template>
  <div>
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="标题名称" class="el-message-box__wrapper" style="z-index: 2001;">
      <div class="el-message-box">
        <div class="el-message-box__header">
          <div class="el-message-box__title"><!---->
            <span>标题名称</span>
          </div>
          <button type="button" aria-label="Close" class="el-message-box__headerbtn"><i class="el-message-box__close el-icon-close"></i></button>
        </div>
        <div class="el-message-box__content"><!---->
          <div class="el-message-box__message">
            <p>这是一段内容</p>
          </div>
          <div class="el-message-box__input" style="display: none;">
            <div class="el-input"><!---->
              <input type="text" autocomplete="off" placeholder="" class="el-input__inner"><!----><!----><!---->
            </div>
            <div class="el-message-box__errormsg" style="visibility: hidden;"></div>
          </div>
        </div>
        <div class="el-message-box__btns"><!---->
          <button type="button" class="el-button el-button--default el-button--small el-button--primary "><!----><!---->
            <span>确定</span>
          </button>
        </div>
      </div>
    </div>
    <div class="v-modal" tabindex="0" style="z-index: 2000;"></div>
  </div>
</template>

<script>
  export default {
    name: 'overUploadBox'
  }
</script>
