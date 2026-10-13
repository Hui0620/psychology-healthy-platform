<template>
  <div style="padding: 24px;">
    <h2>模型详细信息</h2>
    <el-descriptions title="模型基本信息" :column="2" border>
      <el-descriptions-item label="模型类型">{{ model.type }}</el-descriptions-item>
      <el-descriptions-item label="参与机构">{{ model.orgs.join('、') }}</el-descriptions-item>
      <el-descriptions-item label="模型功能" :span="2">{{ model.function }}</el-descriptions-item>
      <el-descriptions-item label="技术介绍" :span="2">{{ model.tech }}</el-descriptions-item>
    </el-descriptions>
    <el-table :data="model.rounds" style="margin-top: 20px">
      <el-table-column prop="round" label="轮次" width="60"/>
      <el-table-column prop="gradient" label="梯度" width="80"/>
      <el-table-column prop="score" label="评分" width="60"/>
      <el-table-column prop="reward" label="奖励" width="60"/>
    </el-table>
    <el-button style="margin-top: 20px" @click="$router.back()">返回</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const model = ref({
  type: '',
  orgs: [],
  function: '',
  tech: '',
  rounds: []
})

// 示例数据，可替换为实际接口请求
const mockModels = [
  {
    id: '1',
    type: '全局模型',
    orgs: ['某大学', '某医院'],
    function: '用于大学生心理健康风险预测与干预建议',
    tech: '基于联邦学习和深度神经网络，结合NLP文本分析技术',
    rounds: [
      { round: 1, gradient: 269, score: 8, reward: 9 },
      { round: 2, gradient: 312, score: 8, reward: 9 },
      { round: 3, gradient: 282, score: 9, reward: 10 },
      { round: 4, gradient: 47, score: 9, reward: 10 },
      { round: 5, gradient: 15, score: 7, reward: 8 },
      { round: 6, gradient: 199, score: 7, reward: 8 },
      { round: 7, gradient: 226, score: 8, reward: 9 },
      { round: 8, gradient: 214, score: 7, reward: 9 },
      { round: 9, gradient: 222, score: 8, reward: 9 },
      { round: 10, gradient: 82, score: 7, reward: 8 }
    ]
  }
  // 可添加更多模型
]

onMounted(() => {
  const id = route.params.id
  const found = mockModels.find(m => m.id === id)
  if (found) {
    model.value = found
  }
})
</script> 