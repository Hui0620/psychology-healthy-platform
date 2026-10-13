<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import router from "@/router/index.js"

const form = reactive({
  // 基础信息
  patientId: '',
  patientName: '',
  age: '',
  gender: '',
  studentId: '',
  school: '',
  visitDate: '',
  dataPeriod: '',
  
  // 主诉
  mainComplaint: '',
  status: '治疗中',
  
  // 临床评估
  interviewSummary: {
    academicPressure: '',
    interpersonal: '',
    cognitiveDistortion: ''
  },
  
  // 量表评估
  phq9Score: '',
  lsasScore: '',
  iatScore: '',
  
  // 风险监控
  suicideRisk: '',
  dataEthics: '',
  
  // 诊断结果
  diagnosis: '',
  
  // 干预计划
  interventionPlan: {
    behaviorControl: '',
    academicSupport: ''
  }
})

const rules = {
  patientId: [{ required: true, message: '请输入病历号', trigger: 'blur' }],
  patientName: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  school: [{ required: true, message: '请输入院校', trigger: 'blur' }],
  mainComplaint: [{ required: true, message: '请输入主诉', trigger: 'blur' }],
  diagnosis: [{ required: true, message: '请输入诊断结果', trigger: 'blur' }]
}

const formRef = ref()

onMounted(() => {
  // 设置就诊日期为当天
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  form.visitDate = `${year}年${month}月${day}日`
  
  // 设置数据采集周期为最近一个月
  const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  const startYear = oneMonthAgo.getFullYear()
  const startMonth = String(oneMonthAgo.getMonth() + 1).padStart(2, '0')
  const startDay = String(oneMonthAgo.getDate()).padStart(2, '0')
  form.dataPeriod = `${startYear}.${startMonth}.${startDay}至${year}.${month}.${day}`
})

function submitForm() {
  formRef.value.validate((valid) => {
    if (valid) {
      // 这里可以添加保存到数据库的逻辑
      console.log('提交表单:', form)
      ElMessage.success('病历保存成功！')
      // 保存成功后跳转到病历号输入页面
      router.push('/index')
    } else {
      ElMessage.error('请完善必填信息')
    }
  })
}

function resetForm() {
  formRef.value.resetFields()
  // 重新设置默认值
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  form.visitDate = `${year}年${month}月${day}日`
  
  const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  const startYear = oneMonthAgo.getFullYear()
  const startMonth = String(oneMonthAgo.getMonth() + 1).padStart(2, '0')
  const startDay = String(oneMonthAgo.getDate()).padStart(2, '0')
  form.dataPeriod = `${startYear}.${startMonth}.${startDay}至${year}.${month}.${day}`
  
  form.status = '治疗中'
}
</script>

<template>
  <div class="new-medical">
    <h2>新增病历</h2>
    
    <el-form 
      ref="formRef"
      :model="form" 
      :rules="rules"
      label-width="140px"
      class="medical-form"
    >
      <!-- 基础信息 -->
      <div class="form-section">
        <h3>基础信息</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="病历号" prop="patientId">
              <el-input v-model="form.patientId" placeholder="请输入病历号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="患者姓名" prop="patientName">
              <el-input v-model="form.patientName" placeholder="请输入患者姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="form.age" placeholder="请输入年龄" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学号" prop="studentId">
              <el-input v-model="form.studentId" placeholder="请输入学号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="院校" prop="school">
              <el-input v-model="form.school" placeholder="请输入院校" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="就诊日期">
              <el-date-picker 
                v-model="form.visitDate" 
                type="date" 
                placeholder="选择就诊日期"
                format="YYYY年MM月DD日"
                value-format="YYYY年MM月DD日"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据采集周期">
              <el-date-picker 
                v-model="form.dataPeriod" 
                type="daterange" 
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY.MM.DD"
                value-format="YYYY.MM.DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option label="治疗中" value="治疗中" />
                <el-option label="已完成" value="已完成" />
                <el-option label="随访中" value="随访中" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 主诉 -->
      <div class="form-section">
        <h3>主诉</h3>
        <el-form-item label="主诉" prop="mainComplaint">
          <el-input 
            v-model="form.mainComplaint" 
            type="textarea" 
            :rows="3"
            placeholder="请输入患者主诉（患者原话）"
          />
        </el-form-item>
      </div>

      <!-- 临床评估 -->
      <div class="form-section">
        <h3>临床评估</h3>
        
        <h4>结构化访谈摘要</h4>
        <el-form-item label="学业压力">
          <el-input 
            v-model="form.interviewSummary.academicPressure" 
            type="textarea" 
            :rows="2"
            placeholder="请输入学业压力相关访谈内容"
          />
        </el-form-item>
        
        <el-form-item label="人际关系">
          <el-input 
            v-model="form.interviewSummary.interpersonal" 
            type="textarea" 
            :rows="2"
            placeholder="请输入人际关系相关访谈内容"
          />
        </el-form-item>
        
        <el-form-item label="认知扭曲">
          <el-input 
            v-model="form.interviewSummary.cognitiveDistortion" 
            type="textarea" 
            :rows="2"
            placeholder="请输入认知扭曲相关访谈内容"
          />
        </el-form-item>

        <h4>量表评估</h4>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="PHQ-9评分">
              <el-input 
                v-model="form.phq9Score" 
                placeholder="如：19分（重度抑郁）"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="LSAS评分">
              <el-input 
                v-model="form.lsasScore" 
                placeholder="如：68分（显著回避行为）"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="IAT评分">
              <el-input 
                v-model="form.iatScore" 
                placeholder="如：78分（高风险）"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 风险监控 -->
      <div class="form-section">
        <h3>风险监控与伦理考量</h3>
        
        <el-form-item label="自杀风险评估">
          <el-input 
            v-model="form.suicideRisk" 
            type="textarea" 
            :rows="3"
            placeholder="请输入自杀风险评估内容"
          />
        </el-form-item>
        
        <el-form-item label="数据伦理">
          <el-input 
            v-model="form.dataEthics" 
            type="textarea" 
            :rows="3"
            placeholder="请输入数据伦理相关内容"
          />
        </el-form-item>
      </div>

      <!-- 诊断与干预 -->
      <div class="form-section">
        <h3>诊断与干预</h3>
        
        <h4>诊断结果</h4>
        <el-form-item label="诊断结果" prop="diagnosis">
          <el-input 
            v-model="form.diagnosis" 
            type="textarea" 
            :rows="3"
            placeholder="请输入诊断结果"
          />
        </el-form-item>

        <h4>干预计划</h4>
        <el-form-item label="行为调控">
          <el-input 
            v-model="form.interventionPlan.behaviorControl" 
            type="textarea" 
            :rows="3"
            placeholder="请输入行为调控干预措施"
          />
        </el-form-item>
        
        <el-form-item label="学业支持">
          <el-input 
            v-model="form.interventionPlan.academicSupport" 
            type="textarea" 
            :rows="3"
            placeholder="请输入学业支持干预措施"
          />
        </el-form-item>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button type="primary" @click="submitForm" size="large">保存病历</el-button>
        <el-button @click="resetForm" size="large">重置表单</el-button>
        <el-button @click="router.push('/index')" size="large">返回首页</el-button>
      </div>
    </el-form>
  </div>
</template>

<style scoped>
.new-medical {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.medical-form {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e4e7ed;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  color: #409eff;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-size: 18px;
}

.form-section h4 {
  color: #606266;
  margin: 20px 0 15px 0;
  font-size: 16px;
}

.form-actions {
  text-align: center;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e4e7ed;
}

.form-actions .el-button {
  margin: 0 10px;
}

.dark .medical-form {
  background-color: #2b2b2b;
  color: #ffffff;
}

.dark .form-section {
  border-bottom-color: #4c4c4c;
}

.dark .form-actions {
  border-top-color: #4c4c4c;
}
</style> 