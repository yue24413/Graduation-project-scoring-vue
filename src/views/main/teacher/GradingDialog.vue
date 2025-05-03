<script setup lang="ts">
import { CommonService } from '@/services'
import { useUserStore } from '@/stores/UserStore'
import type { PSDetail, ProcessScore, StudentProcessScore } from '@/types'
import { computed, ref, watch } from 'vue'
interface Props {
  processId: string
  student: StudentProcessScore
  close: () => void
  addProcessScore: (aps: ProcessScore) => void
}
const props = defineProps<Props>()
const dialogVisible = ref(true)
//需要得到某个过程中的所有子项，动态描述名称以及占比
const processesS = await CommonService.listProcessesService()
//得到具体的过程
const process = processesS.value.find((p) => p.id == props.processId)
//过程下的具体项
const processItems = process?.items ?? []
console.log(props.student)
const userS = useUserStore().userS.value
const currentTeacherScore = props.student.psTeachers?.find((t) => t.teacherId == userS?.id)

//先判断当前教师是否评过分
/**
   * 深拷贝：直接赋值会导致引用共享,会指向同一个对象
   * 使用 toRaw 函数将 currentTeacherScore 转换为原始对象，去除其响应式特性。
使用 JSON.stringify 将原始对象转换为 JSON 字符串。
使用 JSON.parse 将 JSON 字符串解析为新的对象。
PSDetailTeacher 包含了所有 PSDetail 所需的属性，并且额外的属性不会引起问题（因为它们都是可选的）。
   */
const scoreInfoR = ref<ProcessScore>({})
const psDetailR = ref<PSDetail>({})
if (currentTeacherScore) {
  // psDetailR.value = JSON.parse(JSON.stringify(toRaw(currentTeacherScore)))
  psDetailR.value = JSON.parse(JSON.stringify(currentTeacherScore))
  if (!psDetailR.value.detail) {
    psDetailR.value.score = 0
    psDetailR.value.detail = []
    processItems.forEach((item) => {
      psDetailR.value.detail?.push({ score: 0, number: item.number! })
    })
  }
} else {
  psDetailR.value.score = 0
  psDetailR.value.detail = []
  processItems.forEach((item) => {
    psDetailR.value.detail?.push({ score: 0, number: item.number! })
  })
}
const autoScore = ref(currentTeacherScore?.score ?? 0)
watch(autoScore, () => {
  const score = autoScore.value
  psDetailR.value.score = score
  console.log(psDetailR.value.detail)
  if (!psDetailR.value.detail) return
  // 随机数
  let temp = 0
  const psDetailTemp = [...psDetailR.value.detail]
  while (psDetailTemp.length > 1) {
    //Math.random() 生成一个介于 0 和 1 之间的随机浮点数 Math.floor 将浮点数向下取整
    //弊端： 随机数有可能是负数，和项数有关，循环项数-1次，当随机数<循环项数-1次时， 并且每次都碰巧向上取整，则可能会溢出，最后一项会有负数的情况
    const randomIndex = Math.floor(Math.random() * psDetailTemp.length)
    const psDetail = psDetailTemp[randomIndex]
    const item = processItems.find((pi) => pi.number === psDetail.number)
    console.log('item.number', item?.number)

    const result = score * 0.01 * (item?.point ?? 0)
    console.log('result:', result)

    const randomScore = Math.random() > 0.5 ? Math.ceil(result) : Math.floor(result)
    console.log('randomScore:', randomScore)

    psDetail.score = randomScore
    psDetailTemp.splice(randomIndex, 1)
    temp += randomScore
  }
  // 最后一项填充剩余分数
  psDetailTemp[0].score = score - temp
})
const onInputAutoF = () => {
  autoScore.value > 100 && (autoScore.value = 100)
}

//输入框获得焦点时，选中输入框中的内容
//当用户点击输入框时，输入框中的内容会被自动选中。这样用户可以直接输入新内容，而不需要手动删除原有的内容。
const onFocusF = (event: FocusEvent) => {
  ;(event.target as HTMLInputElement).select()
}
//输入的分数是否超过最大值，如果是,则设置为最大值
const onInputF = (index: number) => {
  if (psDetailR.value.detail![index].score > processItems[index].point!) {
    psDetailR.value.detail![index].score = processItems[index].point ?? 0
  }
  let temp = 0
  psDetailR.value.detail?.forEach((d) => {
    temp += d.score
  })
  psDetailR.value.score = temp
}

const submitF = () => {
  if (!userS) return
  scoreInfoR.value.teacherId = userS.id
  scoreInfoR.value.studentId = props.student.student?.id
  scoreInfoR.value.processId = props.processId
  psDetailR.value.teacherName = userS.name
  // scoreInfoR.value.detail = toRaw(psDetailR.value)
  scoreInfoR.value.detail = psDetailR.value
  currentTeacherScore && (scoreInfoR.value.id = currentTeacherScore.processScoreId)
  // props.addProcessScore(toRaw(scoreInfoR.value))
  props.addProcessScore(scoreInfoR.value)
  props.close()
}
//
const wWidth = ref(window.innerWidth)
const widthC = computed(() => {
  return wWidth.value < 768 ? '80%' : '50%'
})
</script>
<template>
  <div>
    <el-dialog v-model="dialogVisible" title="Grading" :width="widthC" @close="props.close">
      <el-row class="row" :gutter="10">
        <el-col :span="6" class="col-title">
          <el-text type="primary" size="large">{{ props.student.student?.name }}</el-text>
          平均分
        </el-col>
        <el-col :span="10">
          <el-text type="primary" size="large">{{ props.student.averageScore }}</el-text>
        </el-col>
      </el-row>

      <el-row class="row" :gutter="10">
        <el-col :span="6" class="col-title">自动分配评分</el-col>
        <el-col :span="10">
          <!-- 将输入值转换为数字类型 -->
          <el-input
            v-model.number="autoScore"
            @input="onInputAutoF"
            @keyup.enter="submitF"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="row" v-for="(p, index) of processItems" :key="index">
        <el-col :span="6" class="col-title">{{ p.name }}-{{ p.point }}</el-col>
        <el-col :span="10">
          <el-input
            type="number"
            v-on:input="onInputF(index)"
            :value="psDetailR.detail![index].score"
            v-model.number="psDetailR.detail![index].score"
            @focus="onFocusF" />
        </el-col>
      </el-row>
      <el-row :gutter="10" class="row">
        <el-col :span="6" class="col-title">评分</el-col>
        <el-col :span="4">
          <el-text type="primary" size="large">{{ psDetailR.score }}</el-text>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="row">
        <el-col :span="6"></el-col>
        <el-col :span="12">
          <el-button type="primary" @click="submitF">提交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<style scoped>
.row {
  margin-bottom: 5px;
  align-items: center;
}
.col-title {
  text-align: right;
}
</style>
