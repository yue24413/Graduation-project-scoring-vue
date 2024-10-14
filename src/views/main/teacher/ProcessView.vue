<script setup lang="ts">
import { CommonService } from '@/services'
import { PA_REVIEW } from '@/services/Const'
import { TeacherService } from '@/services/TeacherService'
import type { LevelCount } from '@/type/index'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
//从地址中得到过程id以及过程身份
const params = useRoute().params as { pid: string; auth: string }

//result数组封装各个功能
const result = await Promise.all([
  params.auth == PA_REVIEW
    ? TeacherService.listTutorStudentsService()
    : TeacherService.listGroupStudentsService(),
  TeacherService.listProcessesProcessScoresService(params.pid, params.auth),
  CommonService.listProcessesService()
])
const studentsS = result[0]
const levelCount = ref<LevelCount>({
  score_last: 0,
  score_60: 0,
  score_70: 0,
  score_80: 0,
  score_90: 0,
  len: studentsS?.length || 0
})
</script>
<template>
  <div>
    <el-row>
      <el-col>
        <div>
          优秀
          <el-tag :type="levelCount.score_90 > 0 ? 'success' : ''">
            {{ levelCount.score_90 }}
          </el-tag>
          ；良好
          <el-tag :type="levelCount.score_80 > 0 ? 'info' : ''">{{ levelCount.score_80 }}</el-tag>
          ；中等
          <el-tag :type="levelCount.score_70 > 0 ? 'warning' : ''">
            {{ levelCount.score_70 }}
          </el-tag>
          ；及格
          <el-tag :type="levelCount.score_60 > 0 ? 'primary' : ''">
            {{ levelCount.score_60 }}
          </el-tag>
          ；不及格
          <el-tag :type="levelCount.score_last > 0 ? 'danger' : ''">
            {{ levelCount.score_last }}
          </el-tag>
          ；共
          <el-tag>{{ levelCount.len }}</el-tag>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
