<script setup lang="ts">
import { CommonService } from '@/services'
import { TeacherService } from '@/services/TeacherService'

const result = await Promise.all([
  CommonService.listProcessesService(),
  TeacherService.listGroupStudentsService(),
  TeacherService.listProcessScoresGroupService()
])
</script>
<template>
  <div></div>
</template>
