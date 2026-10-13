<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import router from "@/router/index.js"

const form = reactive({
  // 基础信息
  studentName: '',
  gender: '',
  age: '',
  studentId: '',
  school: '',
  firstVisitDate: '',
  
  // 主诉与初步评估
  mainComplaint: '',
  initialAssessment: '',
  
  // 咨询目标与计划
  counselingGoal: '',
  counselingPlan: '',
  
  // 咨询过程摘要
  processSummary: '',
  
  // 心理量表评估
  phq9Score: '',
  lsasScore: '',
  iatScore: '',
  
  // 干预与建议
  intervention: '',
  suggestion: ''
})

const rules = {
  studentName: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  school: [{ required: true, message: '请输入学院', trigger: 'blur' }],
  mainComplaint: [{ required: true, message: '请输入主诉', trigger: 'blur' }],
  initialAssessment: [{ required: true, message: '请输入初步评估', trigger: 'blur' }]
}

const formRef = ref()

onMounted(() => {
  // 设置首次咨询日期为当天
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  form.firstVisitDate = `${year}年${month}月${day}日`
})

function submitForm() {
  formRef.value.validate((valid) => {
    if (valid) {
      // 这里可以添加保存到数据库的逻辑
      console.log('提交表单:', form)
      ElMessage.success('学生心理档案保存成功！')
      // 保存成功后跳转到历史档案页面
      router.push('/counselor')
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
  form.firstVisitDate = `${year}年${month}月${day}日`
}
</script>

<template>
  <div class="new-counselor-medical">
    <h2>新增学生心理档案</h2>
    <el-form 
      ref="formRef"
      :model="form" 
      :rules="rules"
      label-width="140px"
      class="counselor-form"
    >
      <!-- 基础信息 -->
      <div class="form-section">
        <h3>基础信息</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="姓名" prop="studentName">
              <el-input v-model="form.studentName" placeholder="请输入学生姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
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
            <el-form-item label="学号" prop="studentId">
              <el-input v-model="form.studentId" placeholder="请输入学号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学院" prop="school">
              <el-input v-model="form.school" placeholder="请输入学院" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="首次咨询日期">
              <el-date-picker 
                v-model="form.firstVisitDate" 
                type="date" 
                placeholder="选择首次咨询日期"
                format="YYYY年MM月DD日"
                value-format="YYYY年MM月DD日"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 主诉与初步评估 -->
      <div class="form-section">
        <h3>主诉与初步评估</h3>
        <el-form-item label="主诉" prop="mainComplaint">
          <el-input v-model="form.mainComplaint" type="textarea" :rows="2" placeholder="请输入主诉（学生原话）" />
        </el-form-item>
        <el-form-item label="初步评估" prop="initialAssessment">
          <el-input v-model="form.initialAssessment" type="textarea" :rows="2" placeholder="请输入初步心理评估" />
        </el-form-item>
      </div>
      <!-- 咨询目标与计划 -->
      <div class="form-section">
        <h3>咨询目标与计划</h3>
        <el-form-item label="咨询目标">
          <el-input v-model="form.counselingGoal" type="textarea" :rows="2" placeholder="如：缓解焦虑、提升学业动力等" />
        </el-form-item>
        <el-form-item label="咨询计划">
          <el-input v-model="form.counselingPlan" type="textarea" :rows="2" placeholder="如：每周一次个体咨询，辅以团体活动等" />
        </el-form-item>
      </div>
      <!-- 咨询过程摘要 -->
      <div class="form-section">
        <h3>咨询过程摘要</h3>
        <el-form-item label="过程摘要">
          <el-input v-model="form.processSummary" type="textarea" :rows="3" placeholder="简要记录咨询过程中的重要内容" />
        </el-form-item>
      </div>
      <!-- 心理量表评估 -->
      <div class="form-section">
        <h3>心理量表评估</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="PHQ-9评分">
              <el-input v-model="form.phq9Score" placeholder="如：19分（重度抑郁）" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="LSAS评分">
              <el-input v-model="form.lsasScore" placeholder="如：68分（显著回避行为）" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="IAT评分">
              <el-input v-model="form.iatScore" placeholder="如：78分（高风险）" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 干预与建议 -->
      <div class="form-section">
        <h3>干预与建议</h3>
        <el-form-item label="干预措施">
          <el-input v-model="form.intervention" type="textarea" :rows="2" placeholder="如：CBT、家庭沟通、学业调整等" />
        </el-form-item>
        <el-form-item label="后续建议">
          <el-input v-model="form.suggestion" type="textarea" :rows="2" placeholder="如：继续随访、建议转诊等" />
        </el-form-item>
      </div>
      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button type="primary" @click="submitForm" size="large">保存档案</el-button>
        <el-button @click="resetForm" size="large">重置表单</el-button>
        <el-button @click="router.push('/counselor')" size="large">返回首页</el-button>
      </div>
    </el-form>
  </div>
</template>

<style scoped>
.new-counselor-medical {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}
.counselor-form {
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
  color: #67c23a;
  border-bottom: 2px solid #67c23a;
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-size: 18px;
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
</style> 