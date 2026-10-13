<script setup>
import { ref, reactive } from 'vue'
import { Search } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"

const patientId = ref('')
const isLoading = ref(false)
const currentRecord = ref(null)

// 模拟病历数据库
const medicalRecordsDatabase = {
  '001': {
    id: '001',
    patientName: '王××',
    age: 21,
    gender: '男',
    studentId: '202302×××',
    school: '××大学计算机学院',
    visitDate: '2023年11月20日',
    dataPeriod: '2023.09.01-2023.11.20',
    diagnosis: '重度抑郁发作，社交焦虑障碍',
    status: '治疗中',
    mainComplaint: '最近两个月根本不想去上课，每天打游戏到凌晨，和室友吵架后更难受了',
    detailed: true
  },
  '002': {
    id: '002',
    patientName: '李四',
    age: 20,
    gender: '女',
    studentId: '202301×××',
    school: '××大学文学院',
    visitDate: '2023年12月15日',
    dataPeriod: '2023.10.01-2023.12.15',
    diagnosis: '轻度焦虑',
    status: '已完成',
    mainComplaint: '考试前总是很紧张，睡不好觉',
    detailed: false
  },
  '003': {
    id: '003',
    patientName: '张三',
    age: 22,
    gender: '男',
    studentId: '202304×××',
    school: '××大学医学院',
    visitDate: '2024年01月10日',
    dataPeriod: '2023.12.01-2024.01.10',
    diagnosis: '社交恐惧症',
    status: '治疗中',
    mainComplaint: '害怕在公共场合发言，每次小组讨论都很紧张',
    detailed: true
  }
}

function searchPatient() {
  if (!patientId.value.trim()) {
    ElMessage.warning('请输入病历号')
    return
  }
  
  console.log('搜索病历号:', patientId.value)
  
  // 直接设置记录，不显示对话框
  const record = medicalRecordsDatabase[patientId.value]
  console.log('找到记录:', record)
  if (record) {
    currentRecord.value = record
    ElMessage.success(`成功加载病历号 ${patientId.value} 的信息`)
  } else {
    ElMessage.error(`未找到病历号 ${patientId.value} 的记录`)
  }
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    searchPatient()
  }
}

function closeDialog() {
  currentRecord.value = null
  patientId.value = ''
}
</script>

<template>
  <div class="patient-id-input" v-loading="isLoading" element-loading-text="正在加载病历信息...">
    <!-- 病历号输入界面 -->
    <div v-if="!currentRecord" class="input-container">
      <h2>请输入病人病历号</h2>
      <p class="description">请输入要查询的病人病历号，系统将显示该病人的详细病历信息</p>
      
      <div class="search-form">
        <el-input 
          v-model="patientId" 
          placeholder="请输入病历号" 
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
          @click="searchPatient"
          style="margin-left: 10px;"
        >
          查询病历
        </el-button>
      </div>
      
      <div class="tips">
        <h4>使用说明：</h4>
        <ul>
          <li>病历号通常为数字或字母数字组合</li>
          <li>输入病历号后点击"查询病历"按钮或按回车键</li>
          <li>系统将显示该病人的完整病历信息</li>
        </ul>
      </div>
    </div>

    <!-- 病历详情显示 -->
    <div v-if="currentRecord" class="medical-detail-container">
      <div class="detail-header">
        <h2>大学生心理科智能评估病历</h2>
        <el-button @click="closeDialog" type="info">返回查询</el-button>
      </div>
      
      <div class="medical-detail">
        <!-- 基本信息 -->
        <div class="section center-section">
          <h3>基本信息</h3>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="姓名">{{ currentRecord.patientName }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ currentRecord.gender }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{ currentRecord.age }}岁</el-descriptions-item>
            <el-descriptions-item label="学号">{{ currentRecord.studentId }}</el-descriptions-item>
            <el-descriptions-item label="院校">{{ currentRecord.school }}</el-descriptions-item>
            <el-descriptions-item label="就诊日期">{{ currentRecord.visitDate }}</el-descriptions-item>
            <el-descriptions-item label="数据采集周期">{{ currentRecord.dataPeriod }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <!-- 一、主诉 -->
        <div class="section">
          <h3>一、主诉</h3>
          <p><strong>主诉：</strong>"最近两个月根本不想去上课，每天打游戏到凌晨，和室友吵架后更难受了"（患者原话）。</p>
          <div class="alert-section">
            <h4>数字化行为报警：</h4>
            <ul>
              <li>▶ 智能手环连续30天睡眠时长小于5小时（触发校心理中心预警系统）</li>
              <li>▶ 校园卡消费记录显示近2周食堂就餐次数下降62%</li>
            </ul>
          </div>
        </div>

        <!-- 临床评估 -->
        <div class="section">
          <h3>二、临床评估与精神检查</h3>
          
          <h4>1. 结构化访谈摘要：</h4>
          <div class="interview-summary">
            <p><strong>学业压力：</strong>自述"完全看不懂Python作业"，但拒绝助教帮助（认为"求助=无能"）</p>
            <p><strong>人际关系：</strong>与室友因"游戏音量"发生肢体冲突，现独居校外出租屋</p>
            <p><strong>认知扭曲：</strong>存在"全或无"思维（"挂科就意味着人生失败"）</p>
          </div>

          <h4>2. 精神状态检查（MSE）：</h4>
          <el-table :data='[
            { dimension: "外观", observation: "衣着邋遢（同一件卫衣穿3天），身上有泡面气味" },
            { dimension: "言语", observation: "语速快且防御性强，多次打断医生提问" },
            { dimension: "情绪", observation: "自评情绪\"愤怒6/10，绝望8/10\"，观察到频繁咬指甲" }
          ]' border>
            <el-table-column prop="dimension" label="维度" width="100" />
            <el-table-column prop="observation" label="观察结果" />
          </el-table>

          <h4>3. 量表评估：</h4>
          <ul>
            <li>PHQ-9：19分（重度抑郁）</li>
            <li>LSAS社交焦虑量表：68分（显著回避行为）</li>
            <li>网络成瘾量表（IAT）：78分（高风险）</li>
          </ul>
        </div>

        <!-- 风险监控 -->
        <div class="section">
          <h3>三、风险监控与伦理考量</h3>
          
          <h4>自杀风险：</h4>
          <ul>
            <li>基于机器学习模型（历史数据+实时行为）动态评估风险等级，当前风险概率23%</li>
            <li>宿舍管理员每日人脸识别签到，连续12小时未出寝触发预警</li>
          </ul>

          <h4>数据伦理：</h4>
          <ul>
            <li>签署《多模态数据使用同意书》，明确数据仅用于临床干预</li>
            <li>去标识化处理后的行为数据用于校园心理健康研究（IRB批准号：PSY2023-××）</li>
          </ul>
        </div>

        <!-- 诊断与干预方案 -->
        <div class="section">
          <h3>四、诊断与智能干预方案</h3>
          
          <h4>多轴诊断（DSM-5）：</h4>
          <ul>
            <li>轴I：F32.2 重度抑郁发作，F40.1 社交焦虑障碍</li>
            <li>轴II：Z73.3 拖延行为模式</li>
            <li>轴III：Z72.811 昼夜节律失调</li>
          </ul>

          <h4>干预计划：</h4>
          <div class="intervention-plan">
            <div class="intervention-item">
              <h5>行为调控：</h5>
              <ul>
                <li>安装SleepTownAPP强制23:00锁屏，达成睡眠目标可解锁外卖优惠券</li>
                <li>智能手环设置步数阶梯目标：第1周1000步/日→第4周5000步/日</li>
              </ul>
            </div>
            <div class="intervention-item">
              <h5>学业支持：</h5>
              <ul>
                <li>与教务处协商：允许缓考2门课程（需提供医疗证明）</li>
                <li>安排专业老师进行一对一辅导</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.patient-id-input {
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
  color: #409eff;
  margin-bottom: 20px;
  font-size: 24px;
}

.description {
  color: #606266;
  margin-bottom: 30px;
  font-size: 14px;
  line-height: 1.5;
}

.search-form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.tips {
  text-align: left;
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.tips h4 {
  color: #409eff;
  margin-top: 0;
  margin-bottom: 10px;
}

.tips ul {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.tips li {
  margin-bottom: 5px;
  line-height: 1.5;
}

/* 病历详情样式 */
.medical-detail-container {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: left;
  min-width: 400px;
  max-width: 800px; /* Adjust as needed */
  margin: 20px auto;
}

.medical-detail-container.left-align {
  text-align: left;
}

.center-section {
  text-align: center;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

.detail-header h2 {
  color: #409eff;
  margin: 0;
  font-size: 24px;
}

.medical-detail {
  max-height: 70vh;
  overflow-y: auto;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  color: #409eff;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.section h4 {
  color: #606266;
  margin: 20px 0 10px 0;
}

.alert-section {
  background-color: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  padding: 15px;
  margin: 15px 0;
}

.alert-section h4 {
  color: #409eff;
  margin-top: 0;
}

.interview-summary p {
  margin: 10px 0;
  line-height: 1.6;
}

.intervention-plan {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.intervention-item {
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 15px;
}

.intervention-item h5 {
  color: #409eff;
  margin-top: 0;
  margin-bottom: 10px;
}

.intervention-item ul {
  margin: 0;
  padding-left: 20px;
}

.intervention-item li {
  margin-bottom: 5px;
  line-height: 1.5;
}

.medical-detail ul {
  padding-left: 20px;
}

.medical-detail li {
  margin-bottom: 5px;
  line-height: 1.5;
}

.dark .patient-id-input {
  background-color: #1f2023;
}

.dark .input-container {
  background-color: #2b2b2b;
  color: #ffffff;
}

.dark .tips {
  background-color: #2b2b2b;
  border-left-color: #409eff;
}
</style> 