<script setup lang="ts">
import { createNoticeBoard } from '@/components/Notice'
import { processAuths } from '@/services/Const'
import { TeacherService } from '@/services/TeacherService'
import type { Process, ProcessItem, StudentAttach } from '@/types'
import { Check, Minus, Plus } from '@element-plus/icons-vue'
import { computed, ref, render } from 'vue'

const prop = defineProps<{ process: Process }>()
const dialogVisible = ref(true)
const processR = ref<Process>(JSON.parse(JSON.stringify(prop.process)))
const processItemR = ref<ProcessItem>({})
const processItemsR = ref<ProcessItem[]>(processR.value.items ?? [])
//
const processAttachR = ref<StudentAttach>({})
const processAttachsR = ref<StudentAttach[]>(processR.value.studentAttach ?? [])

const delItemF = (item: ProcessItem) => {
  const index = processItemsR.value.indexOf(item)
  processItemsR.value.splice(index, 1)
}

const delAttachF = (att: StudentAttach) => {
  const index = processAttachsR.value.indexOf(att)
  processAttachsR.value.splice(index, 1)
}

const addItemF = () => {
  processItemR.value.number = processItemsR.value.length
  processItemsR.value.push(processItemR.value)
  processItemR.value = {}
  processR.value.items = processItemsR.value
}

const addAttachF = () => {
  processAttachR.value.number = processAttachsR.value.length
  processAttachsR.value.push(processAttachR.value)
  processAttachR.value = {}
  processR.value.studentAttach = processAttachsR.value
}

const updateProcessF = async () => {
  await TeacherService.updateProcessService(processR.value)
  createNoticeBoard('过程更新成功', '')
  dialogVisible.value = false
  processR.value = {}
}
const pointC = computed(() => {
  let points = 0
  processItemsR.value.forEach((i) => i.point && (points = i.point + points))
  return points == 100
})
const closeF = () => render(null, document.body)
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    title="Message"
    width="50%"
    :close-on-click-modal="false"
    @close="closeF">
    <div>
      <el-row :gutter="10" style="margin-bottom: 10px">
        <el-col :span="6">
          <el-input v-model="processR.name" placeholder="名称" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="processR.point" placeholder="比例" />
        </el-col>
        <el-col :span="6">
          <el-select v-model="processR.auth" placeholder="类型">
            <el-option
              v-for="(pa, index) in processAuths"
              :key="index"
              :label="pa.name"
              :value="pa.v"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <el-row
      :gutter="10"
      v-for="(item, index) of processItemsR"
      :key="index"
      style="margin-bottom: 10px">
      <el-col :span="6">
        {{ item.name }}
      </el-col>
      <el-col :span="6">
        {{ item.point }}
      </el-col>
      <el-col :span="6">
        <el-button
          type="danger"
          size="small"
          circle
          :icon="Minus"
          @click="delItemF(item)"></el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-bottom: 10px">
      <el-col :span="6">
        <el-input v-model="processItemR.name" placeholder="项名称" />
      </el-col>
      <el-col :span="6">
        <el-input v-model.number="processItemR.point" placeholder="比例" type="number" />
      </el-col>
      <el-col :span="6">
        <el-button type="success" :icon="Plus" size="small" circle @click="addItemF"></el-button>
      </el-col>
    </el-row>
    <el-row
      :gutter="10"
      v-for="(item, index) of processAttachsR"
      :key="index"
      style="margin-bottom: 10px">
      <el-col :span="6">
        {{ item.name }}
      </el-col>
      <el-col :span="6">
        {{ item.ext }}
      </el-col>
      <el-col :span="6">
        <el-button
          type="danger"
          size="small"
          circle
          :icon="Minus"
          @click="delAttachF(item)"></el-button>
      </el-col>
    </el-row>

    <el-row :gutter="10" style="margin-bottom: 10px">
      <el-col :span="6">
        <el-input v-model="processAttachR.name" placeholder="学生附件名称" />
      </el-col>
      <el-col :span="6">
        <el-input v-model="processAttachR.ext" placeholder="文件扩展名。 .ppt, .pptx" />
      </el-col>
      <el-col :span="6">
        <el-button type="success" :icon="Plus" size="small" circle @click="addAttachF"></el-button>
      </el-col>
    </el-row>
    {{ processR }}
    <br />
    <el-button type="success" :icon="Check" @click="updateProcessF" :disabled="!pointC" />
    <span v-if="!pointC" style="color: red">子项分数之和应为100分</span>
  </el-dialog>
</template>
