<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('collector')

const dataCollectors = reactive({
  behavior: { sleepPattern: '', exerciseHabit: '', lifestyle: '', collected: false },
  social: { socialNetwork: '', relationships: '', communication: '', collected: false },
  emotion: { emotionState: '', stressLevel: '', emotionChange: '', collected: false },
  academic: { academicPerformance: '', studyHabit: '', courseParticipation: '', collected: false }
})

function collectAllData() {
  // 生成行为数据
  dataCollectors.behavior.sleepPattern = '每晚11点入睡，7点起床，睡眠质量良好'
  dataCollectors.behavior.exerciseHabit = '每周跑步3次，每次30分钟，偶尔打篮球'
  dataCollectors.behavior.lifestyle = '作息规律，饮食健康，不吸烟不喝酒'
  dataCollectors.behavior.collected = true

  // 生成社交数据
  dataCollectors.social.socialNetwork = '微信好友200人，QQ群5个，微博关注50人'
  dataCollectors.social.relationships = '与室友关系融洽，与同学交往积极，与老师沟通良好'
  dataCollectors.social.communication = '善于倾听，表达清晰，在小组讨论中表现活跃'
  dataCollectors.social.collected = true

  // 生成情绪数据
  dataCollectors.emotion.emotionState = '情绪稳定，大部分时间保持积极乐观'
  dataCollectors.emotion.stressLevel = '学习压力中等，偶尔感到焦虑但能自我调节'
  dataCollectors.emotion.emotionChange = '情绪波动较小，遇到困难时能保持冷静'
  dataCollectors.emotion.collected = true

  // 生成学业数据
  dataCollectors.academic.academicPerformance = '学习成绩优秀，GPA 3.8，专业排名前10%'
  dataCollectors.academic.studyHabit = '每天学习6-8小时，有明确的学习计划和目标'
  dataCollectors.academic.courseParticipation = '课堂参与度高，积极回答问题，按时完成作业'
  dataCollectors.academic.collected = true

  ElMessage.success('数据采集完成！')
}

function generateProfile() {
  activeTab.value = 'profile'
}
</script>

<template>
  <div class="user-profile">
    <h2>用户画像</h2>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="数据采集器" name="collector">
        <div class="collectors">
          <!-- 行为数据采集器 -->
          <el-card class="collector-card">
            <template #header>行为数据采集器</template>
            <el-form label-width="120px">
              <el-form-item label="睡眠模式">
                <el-input v-model="dataCollectors.behavior.sleepPattern" />
              </el-form-item>
              <el-form-item label="运动习惯">
                <el-input v-model="dataCollectors.behavior.exerciseHabit" />
              </el-form-item>
              <el-form-item label="生活方式">
                <el-input v-model="dataCollectors.behavior.lifestyle" />
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 社交数据采集器 -->
          <el-card class="collector-card">
            <template #header>社交数据采集器</template>
            <el-form label-width="120px">
              <el-form-item label="社交网络">
                <el-input v-model="dataCollectors.social.socialNetwork" />
              </el-form-item>
              <el-form-item label="人际关系">
                <el-input v-model="dataCollectors.social.relationships" />
              </el-form-item>
              <el-form-item label="沟通模式">
                <el-input v-model="dataCollectors.social.communication" />
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 情绪数据采集器 -->
          <el-card class="collector-card">
            <template #header>情绪数据采集器</template>
            <el-form label-width="120px">
              <el-form-item label="情绪状态">
                <el-input v-model="dataCollectors.emotion.emotionState" />
              </el-form-item>
              <el-form-item label="压力水平">
                <el-input v-model="dataCollectors.emotion.stressLevel" />
              </el-form-item>
              <el-form-item label="情绪变化">
                <el-input v-model="dataCollectors.emotion.emotionChange" />
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 学业数据采集器 -->
          <el-card class="collector-card">
            <template #header>学业数据采集器</template>
            <el-form label-width="120px">
              <el-form-item label="学业表现">
                <el-input v-model="dataCollectors.academic.academicPerformance" />
              </el-form-item>
              <el-form-item label="学习习惯">
                <el-input v-model="dataCollectors.academic.studyHabit" />
              </el-form-item>
              <el-form-item label="课程参与度">
                <el-input v-model="dataCollectors.academic.courseParticipation" />
              </el-form-item>
            </el-form>
          </el-card>
        </div>

        <div class="generate-button">
          <el-button type="primary" @click="collectAllData" style="margin-right: 20px;">采集所有数据</el-button>
          <el-button type="success" @click="generateProfile">生成用户画像</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="画像展示" name="profile">
        <div v-if="!dataCollectors.behavior.collected" class="no-data">
          <el-empty description="请先采集数据" />
        </div>
        <div v-else class="profiles">
          <el-card>
            <template #header>行为画像</template>
            <p>睡眠模式: {{ dataCollectors.behavior.sleepPattern || '未填写' }}</p>
            <p>运动习惯: {{ dataCollectors.behavior.exerciseHabit || '未填写' }}</p>
            <p>生活方式: {{ dataCollectors.behavior.lifestyle || '未填写' }}</p>
          </el-card>

          <el-card>
            <template #header>社交画像</template>
            <p>社交网络: {{ dataCollectors.social.socialNetwork || '未填写' }}</p>
            <p>人际关系: {{ dataCollectors.social.relationships || '未填写' }}</p>
            <p>沟通模式: {{ dataCollectors.social.communication || '未填写' }}</p>
          </el-card>

          <el-card>
            <template #header>情绪画像</template>
            <p>情绪状态: {{ dataCollectors.emotion.emotionState || '未填写' }}</p>
            <p>压力水平: {{ dataCollectors.emotion.stressLevel || '未填写' }}</p>
            <p>情绪变化: {{ dataCollectors.emotion.emotionChange || '未填写' }}</p>
          </el-card>

          <el-card>
            <template #header>学业画像</template>
            <p>学业表现: {{ dataCollectors.academic.academicPerformance || '未填写' }}</p>
            <p>学习习惯: {{ dataCollectors.academic.studyHabit || '未填写' }}</p>
            <p>课程参与度: {{ dataCollectors.academic.courseParticipation || '未填写' }}</p>
          </el-card>

          <el-card class="comprehensive">
            <template #header>综合画像</template>
            <p>综合评分: 85分</p>
            <p>评估: 综合表现良好，心理健康状况稳定，建议继续保持</p>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.user-profile {
  padding: 20px;
}

.collectors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.collector-card {
  margin-bottom: 20px;
}

.generate-button {
  text-align: center;
  margin-top: 20px;
}

.profiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.comprehensive {
  grid-column: 1 / -1;
  background-color: #f5f7fa;
}

.no-data {
  text-align: center;
  padding: 40px;
}
</style> 