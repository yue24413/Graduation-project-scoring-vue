<script setup lang="ts">
import { createMessageDialog } from '@/components/message'
import { CommonService } from '@/services'
import { ref } from 'vue'

const paw = ref({ p1: '', p2: '' })
const resetPwd = async () => {
  if (!paw.value.p1 || paw.value.p1 !== paw.value.p2) {
    createMessageDialog('2次输入密码不同,请重新输入!')
  } else {
    await CommonService.updateSelfPassword(paw.value.p2)
    createMessageDialog('更改密码成功!')
    paw.value.p1 = paw.value.p2 = ''
  }
}
</script>
<template>
  <div style="margin: 30px">
    <el-row class="my-row">
      <el-col :span="8" />
      <el-col :span="8">
        建议修改默认密码
        <br />
        <br />
        <el-input placeholder="password:" v-model="paw.p1" class="my-input"></el-input>
        <br />
        <el-input placeholder="again:" v-model="paw.p2" class="my-input"></el-input>
        <br />
        <el-button :disabled="!paw.p1 && !paw.p2" @click="resetPwd" class="commit">
          commit
        </el-button>
      </el-col>
      <el-col :span="8"></el-col>
    </el-row>
  </div>
</template>
<style scoped>
.my-row {
  margin: 1px;
}
.my-input {
  margin-bottom: 15px;
}
</style>
