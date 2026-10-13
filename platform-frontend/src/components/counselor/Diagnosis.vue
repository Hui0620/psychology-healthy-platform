<script setup>
import { ref } from 'vue'

// 示例心理评估数据
const diagnosis = ref({
  studentName: '张××',
  gender: '男',
  age: 20,
  studentId: '20230517',
  school: '××大学心理学院',
  phq9: 21,
  lsas: 68,
  iat: 78,
  summary: '学生存在重度抑郁症状，社交回避明显，网络依赖风险高。',
  consultantAnalysis: '学生因学业压力和人际冲突导致情绪低落，兴趣减退，建议重点关注其学业支持和情绪调节能力的提升。',
  intervention: [
    '继续认知行为疗法（CBT）咨询，每周1次',
    '建议参加团体社交技能训练',
    '与学院协商学业减负方案',
    '家校协同关注学生情绪变化'
  ]
})
</script>

<template>
  <div class="counselor-diagnosis">
    <h2>心理中心辅助诊断</h2>
    <el-descriptions :column="3" border>
      <el-descriptions-item label="姓名">{{ diagnosis.studentName }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{ diagnosis.gender }}</el-descriptions-item>
      <el-descriptions-item label="年龄">{{ diagnosis.age }}岁</el-descriptions-item>
      <el-descriptions-item label="学号">{{ diagnosis.studentId }}</el-descriptions-item>
      <el-descriptions-item label="学院">{{ diagnosis.school }}</el-descriptions-item>
    </el-descriptions>

    <div class="diagnosis-section">
      <h3>心理量表评估</h3>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover">
            <div>PHQ-9 抑郁量表</div>
            <div class="score">{{ diagnosis.phq9 }} 分</div>
            <div class="desc">重度抑郁</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <div>LSAS 社交回避量表</div>
            <div class="score">{{ diagnosis.lsas }} 分</div>
            <div class="desc">显著回避行为</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <div>IAT 网络成瘾量表</div>
            <div class="score">{{ diagnosis.iat }} 分</div>
            <div class="desc">高风险</div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="diagnosis-section">
      <h3>咨询师分析</h3>
      <el-alert :title="diagnosis.consultantAnalysis" type="warning" show-icon />
    </div>

    <div class="diagnosis-section">
      <h3>干预建议</h3>
      <el-timeline>
        <el-timeline-item
          v-for="(item, idx) in diagnosis.intervention"
          :key="idx"
          type="success"
        >
          {{ item }}
        </el-timeline-item>
      </el-timeline>
    </div>

    <div class="diagnosis-section">
      <h3>综合评估结论</h3>
      <el-alert :title="diagnosis.summary" type="info" show-icon />
    </div>
  </div>
</template>

<style scoped>
.counselor-diagnosis {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.08);
  max-width: 900px;
  margin: 30px auto;
}
.counselor-diagnosis h2 {
  color: #67c23a;
  margin-bottom: 20px;
}
.diagnosis-section {
  margin: 30px 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #e4e7ed;
}
.diagnosis-section:last-child {
  border-bottom: none;
}
.diagnosis-section h3 {
  color: #409eff;
  margin-bottom: 10px;
}
.score {
  font-size: 22px;
  font-weight: bold;
  color: #e6a23c;
  margin: 8px 0 2px 0;
}
.desc {
  color: #909399;
  font-size: 14px;
}
</style> 