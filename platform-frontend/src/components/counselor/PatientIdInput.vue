<script setup>
import { ref, reactive } from 'vue'
import { Search } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"

const patientId = ref('')
const isLoading = ref(false)
const currentRecord = ref(null)

// 模拟心理中心学生档案数据库
const studentRecordsDatabase = {
  '001': {
    id: '001',
    studentName: '王××',
    age: 21,
    gender: '男',
    studentId: '202302×××',
    school: '××大学计算机学院',
    visitDate: '2023年11月20日',
    dataPeriod: '2023.09.01-2023.11.20',
    initialAssessment: '学业压力导致情绪困扰',
    status: '咨询中',
    mainComplaint: '最近两个月根本不想去上课，每天打游戏到凌晨，和室友吵架后更难受了',
    detailed: true
  },
  '002': {
    id: '002',
    studentName: '李四',
    age: 20,
    gender: '女',
    studentId: '202301×××',
    school: '××大学文学院',
    visitDate: '2023年12月15日',
    dataPeriod: '2023.10.01-2023.12.15',
    initialAssessment: '考试焦虑',
    status: '已完成',
    mainComplaint: '考试前总是很紧张，睡不好觉',
    detailed: false
  },
  '003': {
    id: '003',
    studentName: '张三',
    age: 22,
    gender: '男',
    studentId: '202304×××',
    school: '××大学医学院',
    visitDate: '2024年01月10日',
    dataPeriod: '2023.12.01-2024.01.10',
    initialAssessment: '社交恐惧',
    status: '咨询中',
    mainComplaint: '害怕在公共场合发言，每次小组讨论都很紧张',
    detailed: true
  }
}

function searchStudent() {
  if (!patientId.value.trim()) {
    ElMessage.warning('请输入学号')
    return
  }
  
  const record = studentRecordsDatabase[patientId.value]
  if (record) {
    currentRecord.value = record
    ElMessage.success(`成功加载学号 ${patientId.value} 的档案信息`)
  } else {
    ElMessage.error(`未找到学号 ${patientId.value} 的档案记录`)
  }
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    searchStudent()
  }
}

function closeDialog() {
  currentRecord.value = null
  patientId.value = ''
}
</script>

<template>
  <div class="counselor-patient-id-input" v-loading="isLoading" element-loading-text="正在加载档案信息...">
    <!-- 学号输入界面 -->
    <div v-if="!currentRecord" class="input-container">
      <h2>请输入学生学号</h2>
      <p class="description">请输入要查询的学生学号，系统将显示该学生的详细心理档案信息</p>
      
      <div class="search-form">
        <el-input 
          v-model="patientId" 
          placeholder="请输入学号" 
          maxlength="20" 
          size="large"
          @keyup="handleKeyPress"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-button 
          type="primary" 
          size="large" 
          @click="searchStudent"
          style="margin-left: 10px;"
        >
          查询档案
        </el-button>
      </div>
      
      <div class="tips">
        <h4>使用说明：</h4>
        <ul>
          <li>学号通常为数字或字母数字组合</li>
          <li>输入学号后点击"查询档案"按钮或按回车键</li>
          <li>系统将显示该学生的完整心理档案信息</li>
        </ul>
      </div>
    </div>

    <!-- 学生档案详情显示 -->
    <div v-if="currentRecord" class="student-detail-container">
      <div class="detail-header">
        <h2>大学生心理健康档案</h2>
        <el-button @click="closeDialog" type="info">返回查询</el-button>
      </div>
      
      <div class="student-detail">
        <!-- 基础信息 -->
        <div class="section">
          <h3>学生基本信息</h3>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="姓名">{{ currentRecord.studentName }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ currentRecord.gender }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{ currentRecord.age }}岁</el-descriptions-item>
            <el-descriptions-item label="学号">{{ currentRecord.studentId }}</el-descriptions-item>
            <el-descriptions-item label="学院">{{ currentRecord.school }}</el-descriptions-item>
            <el-descriptions-item label="首次咨询日期">{{ currentRecord.visitDate }}</el-descriptions-item>
            <el-descriptions-item label="数据采集周期">{{ currentRecord.dataPeriod }}</el-descriptions-item>
            <el-descriptions-item label="初步评估">{{ currentRecord.initialAssessment }}</el-descriptions-item>
            <el-descriptions-item label="咨询状态">{{ currentRecord.status }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 主诉与咨询记录 -->
        <div class="section">
          <h3>一、主诉与咨询记录</h3>
          <p><strong>主诉：</strong>"{{ currentRecord.mainComplaint }}"（学生原话）</p>
          
          <div class="alert-section">
            <h4>校园行为预警：</h4>
            <ul>
              <li>▶ 连续旷课超过2周（触发学工处预警）</li>
              <li>▶ 宿舍晚归记录频繁（近1月超过15次）</li>
              <li>▶ 图书馆借阅记录显示学习兴趣下降</li>
            </ul>
          </div>
        </div>

        <!-- 心理评估 -->
        <div class="section">
          <h3>二、心理评估与咨询记录</h3>
          
          <h4>1. 咨询过程摘要：</h4>
          <div class="consultation-summary">
            <p><strong>学业压力：</strong>自述"完全看不懂Python作业"，但拒绝助教帮助（认为"求助=无能"）</p>
            <p><strong>人际关系：</strong>与室友因"游戏音量"发生肢体冲突，现独居校外出租屋</p>
            <p><strong>认知模式：</strong>存在"全或无"思维（"挂科就意味着人生失败"）</p>
          </div>

          <h4>2. 心理状态观察：</h4>
          <el-table :data='[
            { aspect: "外观", observation: "衣着邋遢（同一件卫衣穿3天），身上有泡面气味" },
            { aspect: "言语", observation: "语速快且防御性强，多次打断咨询师提问" },
            { aspect: "情绪", observation: "自评情绪\"愤怒6/10，绝望8/10\"，观察到频繁咬指甲" }
          ]' border>
            <el-table-column prop="aspect" label="观察维度" width="100" />
            <el-table-column prop="observation" label="观察结果" />
          </el-table>

          <h4>3. 心理量表评估：</h4>
          <ul>
            <li>PHQ-9：19分（重度抑郁）</li>
            <li>LSAS社交焦虑量表：68分（显著回避行为）</li>
            <li>网络成瘾量表（IAT）：78分（高风险）</li>
          </ul>
        </div>

        <!-- 风险评估 -->
        <div class="section">
          <h3>三、风险评估与干预记录</h3>
          
          <h4>风险等级：</h4>
          <ul>
            <li>基于心理评估模型，当前风险等级：<strong>中等风险</strong></li>
            <li>宿舍管理员每日签到记录，连续12小时未出寝触发预警</li>
          </ul>

          <h4>已采取的干预措施：</h4>
          <ul>
            <li>已进行4次认知行为疗法（CBT）咨询</li>
            <li>与学院辅导员沟通，调整学业要求</li>
            <li>建议家长了解情况并给予支持</li>
          </ul>
        </div>

        <!-- 咨询建议与转诊 -->
        <div class="section">
          <h3>四、咨询建议与后续安排</h3>
          
          <h4>当前咨询建议：</h4>
          <ul>
            <li>继续认知行为疗法，重点关注学业压力管理</li>
            <li>建议参加团体心理辅导活动</li>
            <li>与学院协商学业调整方案</li>
          </ul>

          <h4>转诊建议：</h4>
          <div class="referral-suggestion">
            <div class="referral-item">
              <h5>是否需要转诊：</h5>
              <p>根据当前症状严重程度和咨询效果，建议转诊至精神卫生中心进行进一步评估</p>
            </div>
            <div class="referral-item">
              <h5>转诊理由：</h5>
              <ul>
                <li>抑郁症状严重，PHQ-9评分持续高位</li>
                <li>存在被动自杀意念，需要专业精神科评估</li>
                <li>心理咨询效果有限，需要药物治疗配合</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.counselor-patient-id-input {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 55px);
  background-color: #f5f7fa;
}

.input-container {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 400px;
}

.input-container h2 {
  color: #67c23a;
  margin-bottom: 20px;
  font-size: 24px;
}

.description {
  color: #606266;
  margin-bottom: 30px;
}

.search-form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.tips {
  text-align: left;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
}

.tips h4 {
  color: #67c23a;
  margin-bottom: 10px;
}

.tips ul {
  margin: 0;
  padding-left: 20px;
}

.tips li {
  margin: 5px 0;
  color: #606266;
}

/* 学生档案详情样式 */
.student-detail-container {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 20px auto;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #67c23a;
}

.detail-header h2 {
  color: #67c23a;
  margin: 0;
  font-size: 24px;
}

.student-detail {
  line-height: 1.8;
}

.section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.section:last-child {
  border-bottom: none;
}

.section h3 {
  color: #67c23a;
  border-bottom: 2px solid #67c23a;
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-size: 18px;
}

.section h4 {
  color: #606266;
  margin: 20px 0 15px 0;
  font-size: 16px;
}

.alert-section {
  background-color: #fdf6ec;
  border: 1px solid #f5dab1;
  border-radius: 5px;
  padding: 15px;
  margin: 15px 0;
}

.alert-section h4 {
  color: #e6a23c;
  margin-bottom: 10px;
}

.alert-section ul {
  margin: 0;
  padding-left: 20px;
}

.alert-section li {
  margin: 5px 0;
  color: #606266;
}

.consultation-summary p {
  margin: 10px 0;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.referral-suggestion {
  background-color: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 5px;
  padding: 20px;
  margin: 15px 0;
}

.referral-item {
  margin-bottom: 15px;
}

.referral-item h5 {
  color: #409eff;
  margin-bottom: 10px;
}

.referral-item ul {
  margin: 0;
  padding-left: 20px;
}

.referral-item li {
  margin: 5px 0;
  color: #606266;
}
</style> 