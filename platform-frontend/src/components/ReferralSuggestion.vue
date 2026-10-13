<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import router from "@/router/index.js"

const form = reactive({
  // 患者基本信息
  patientName: '',
  gender: '',
  age: '',
  studentId: '',
  
  // 转诊信息
  referralInstitution: '××大学心理咨询中心',
  receivingInstitution: '××市精神卫生中心',
  referralDate: '',
  urgencyLevel: '优先（72小时内）',
  
  // DSM-5诊断
  axis1: {
    diagnosis1: 'F32.2 重度抑郁发作，单次',
    severity1: '伴忧郁特征',
    diagnosis2: 'F40.1 社交焦虑障碍',
    severity2: '广泛型'
  },
  axis2: {
    diagnosis: 'Z73.3 拖延行为模式',
    severity: '中度功能损害'
  },
  axis3: {
    diagnosis: 'Z72.811 昼夜节律睡眠-觉醒障碍',
    severity: '延迟型'
  },
  axis4: {
    diagnosis: 'Z62.820 学业压力问题',
    severity: '近期加重'
  },
  axis5: {
    currentGAF: '48',
    highestGAF: '72',
    period: '过去一年最高GAF=72'
  },
  
  // 临床症状
  clinicalSymptoms: {
    mood: '持续2个月情绪低落、兴趣减退（PHQ-9=21）',
    rhythm: '伴有晨重暮轻节律、食欲下降（体重减轻7kg）',
    suicide: '存在被动自杀意念（无具体计划）'
  },
  
  // 风险等级
  riskAssessment: {
    suicideRisk: 'SAD PERSONS评分=6分（中风险）',
    violenceRisk: '无伤人史或意图'
  },
  
  // 初步干预效果
  interventionEffect: {
    counseling: '心理咨询（CBT）4次后症状未缓解（抑郁评分下降<10%）',
    academic: '校方学业调整无效（出勤率仍<20%）'
  },
  
  // 辅助资料
  auxiliaryData: {
    digitalBehavior: {
      sleep: '睡眠监测：平均入睡时间03:21，睡眠效率68%',
      activity: '活动轨迹：近1月图书馆访问次数0次'
    },
    labTests: {
      thyroid: '甲状腺功能：TSH 2.3 mIU/L（正常）',
      blood: '血常规：Hb 121g/L（轻度贫血）'
    },
    scales: [
      '附件1：PHQ-9/GAD-7原始评分表',
      '附件2：社交回避量表（LSAS）原始记录'
    ]
  },
  
  // 转诊目的与建议
  referralPurpose: {
    furtherAssessment: [
      '排除双相障碍（需详细情感史采集）',
      '评估抗抑郁药适应症（建议SSRI类优先）'
    ],
    treatmentRecommendation: '日间病房',
    recommendationLevel: '★★☆',
    treatmentPlan: {
      medication: '艾司西酞普兰10mg qd（起始）',
      psychotherapy: '团体社交技能训练（每周2次）',
      physicalTherapy: '光照疗法（针对昼夜节律紊乱）'
    }
  },
  
  // 特殊注意事项
  specialNotes: [
    '患者对"抑郁症"诊断存在病耻感，建议沟通时使用"神经调节失衡"等替代表述',
    '需同步联系家属（已签署《信息共享同意书》）'
  ],
  
  // 医师信息
  doctorInfo: {
    name: '李××',
    licenseNumber: 'PSY123456',
    declaration: '本建议书基于DSM-5诊断标准出具，已向患者解释转诊必要性并获知情同意。根据《精神卫生法》第二十八条，建议接诊机构在48小时内安排评估。'
  }
})

const formRef = ref()
const showPreview = ref(false)

// 新增：中间变量用于多行文本编辑
const furtherAssessmentText = ref(form.referralPurpose.furtherAssessment.join('\n'))

// 监听文本变化，更新数组
watch(furtherAssessmentText, (val) => {
  form.referralPurpose.furtherAssessment = val.split('\n')
})
// 监听数组变化，更新文本（如有需要）
watch(() => form.referralPurpose.furtherAssessment, (arr) => {
  furtherAssessmentText.value = arr.join('\n')
})

onMounted(() => {
  // 设置转诊日期为当天
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  form.referralDate = `${year}年${month}月${day}日`
})

function generateReferral() {
  showPreview.value = true
  ElMessage.success('转诊建议书生成成功！')
}

function saveReferral() {
  ElMessage.success('转诊建议书保存成功！')
  showPreview.value = false
}

function printReferral() {
  window.print()
}

function backToList() {
  showPreview.value = false
}
</script>

<template>
  <div class="referral-suggestion">
    <div v-if="!showPreview">
      <h2>心理科转诊建议书</h2>
      
      <el-form 
        ref="formRef"
        :model="form" 
        label-width="140px"
        class="referral-form"
      >
        <!-- 患者基本信息 -->
        <div class="form-section">
          <h3>患者基本信息</h3>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="患者姓名">
                <el-input v-model="form.patientName" placeholder="请输入患者姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别">
                <el-radio-group v-model="form.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="年龄">
                <el-input v-model="form.age" placeholder="请输入年龄" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="学号">
                <el-input v-model="form.studentId" placeholder="请输入学号" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 转诊信息 -->
        <div class="form-section">
          <h3>转诊信息</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="转诊机构">
                <el-input v-model="form.referralInstitution" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接诊机构">
                <el-input v-model="form.receivingInstitution" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="转诊日期">
                <el-date-picker 
                  v-model="form.referralDate" 
                  type="date" 
                  placeholder="选择转诊日期"
                  format="YYYY年MM月DD日"
                  value-format="YYYY年MM月DD日"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="紧急程度">
                <el-radio-group v-model="form.urgencyLevel">
                  <el-radio label="常规">□常规</el-radio>
                  <el-radio label="优先（72小时内）">■优先（72小时内）</el-radio>
                  <el-radio label="紧急（24小时内）">□紧急（24小时内）</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- DSM-5多轴诊断 -->
        <div class="form-section">
          <h3>DSM-5多轴诊断</h3>
          <el-table :data="[
            { axis: '轴I', diagnosis: form.axis1.diagnosis1, severity: form.axis1.severity1 },
            { axis: '轴I', diagnosis: form.axis1.diagnosis2, severity: form.axis1.severity2 },
            { axis: '轴II', diagnosis: form.axis2.diagnosis, severity: form.axis2.severity },
            { axis: '轴III', diagnosis: form.axis3.diagnosis, severity: form.axis3.severity },
            { axis: '轴IV', diagnosis: form.axis4.diagnosis, severity: form.axis4.severity },
            { axis: '轴V', diagnosis: `GAF=${form.axis5.currentGAF}（当前）`, severity: form.axis5.period }
          ]" border>
            <el-table-column prop="axis" label="轴系" width="80" />
            <el-table-column prop="diagnosis" label="诊断编码与名称" />
            <el-table-column prop="severity" label="严重程度" />
          </el-table>
        </div>

        <!-- 临床症状 -->
        <div class="form-section">
          <h3>临床症状</h3>
          <el-form-item label="情绪症状">
            <el-input 
              v-model="form.clinicalSymptoms.mood" 
              type="textarea" 
              :rows="2"
              placeholder="描述情绪相关症状"
            />
          </el-form-item>
          <el-form-item label="节律症状">
            <el-input 
              v-model="form.clinicalSymptoms.rhythm" 
              type="textarea" 
              :rows="2"
              placeholder="描述节律相关症状"
            />
          </el-form-item>
          <el-form-item label="自杀意念">
            <el-input 
              v-model="form.clinicalSymptoms.suicide" 
              type="textarea" 
              :rows="2"
              placeholder="描述自杀意念情况"
            />
          </el-form-item>
        </div>

        <!-- 风险等级 -->
        <div class="form-section">
          <h3>风险等级</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="自杀风险">
                <el-input v-model="form.riskAssessment.suicideRisk" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="暴力风险">
                <el-input v-model="form.riskAssessment.violenceRisk" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 初步干预效果 -->
        <div class="form-section">
          <h3>初步干预效果</h3>
          <el-form-item label="心理咨询效果">
            <el-input 
              v-model="form.interventionEffect.counseling" 
              type="textarea" 
              :rows="2"
            />
          </el-form-item>
          <el-form-item label="学业调整效果">
            <el-input 
              v-model="form.interventionEffect.academic" 
              type="textarea" 
              :rows="2"
            />
          </el-form-item>
        </div>

        <!-- 转诊目的与建议 -->
        <div class="form-section">
          <h3>转诊目的与建议</h3>
          <el-form-item label="进一步评估">
            <el-input 
              v-model="furtherAssessmentText" 
              type="textarea" 
              :rows="3"
              placeholder="每行一个评估建议"
            />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="治疗建议">
                <el-select v-model="form.referralPurpose.treatmentRecommendation">
                  <el-option label="门诊随访" value="门诊随访" />
                  <el-option label="日间病房" value="日间病房" />
                  <el-option label="住院治疗" value="住院治疗" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="推荐等级">
                <el-input v-model="form.referralPurpose.recommendationLevel" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 医师信息 -->
        <div class="form-section">
          <h3>医师信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="转诊医师">
                <el-input v-model="form.doctorInfo.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="执业证号">
                <el-input v-model="form.doctorInfo.licenseNumber" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="医师声明">
            <el-input 
              v-model="form.doctorInfo.declaration" 
              type="textarea" 
              :rows="3"
            />
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button type="primary" @click="generateReferral" size="large">生成转诊建议书</el-button>
          <el-button @click="router.push('/index')" size="large">返回首页</el-button>
        </div>
      </el-form>
    </div>

    <!-- 转诊建议书预览 -->
    <div v-if="showPreview" class="referral-preview">
      <div class="preview-header">
        <h2>心理科转诊建议书</h2>
        <div class="preview-actions">
          <el-button @click="saveReferral" type="success">保存</el-button>
          <el-button @click="printReferral" type="primary">打印</el-button>
          <el-button @click="backToList" type="info">返回编辑</el-button>
        </div>
      </div>
      
      <div class="referral-content">
        <div class="basic-info">
          <p><strong>患者姓名：</strong>{{ form.patientName }}　<strong>性别：</strong>{{ form.gender }}　<strong>年龄：</strong>{{ form.age }}岁　<strong>学号：</strong>{{ form.studentId }}</p>
          <p><strong>转诊机构：</strong>{{ form.referralInstitution }}　<strong>接诊机构：</strong>{{ form.receivingInstitution }}</p>
          <p><strong>转诊日期：</strong>{{ form.referralDate }}　<strong>紧急程度：</strong>{{ form.urgencyLevel }}</p>
        </div>

        <div class="diagnosis-section">
          <h3>一、DSM-5多轴诊断</h3>
          <el-table :data="[
            { axis: '轴I', diagnosis: form.axis1.diagnosis1, severity: form.axis1.severity1 },
            { axis: '轴I', diagnosis: form.axis1.diagnosis2, severity: form.axis1.severity2 },
            { axis: '轴II', diagnosis: form.axis2.diagnosis, severity: form.axis2.severity },
            { axis: '轴III', diagnosis: form.axis3.diagnosis, severity: form.axis3.severity },
            { axis: '轴IV', diagnosis: form.axis4.diagnosis, severity: form.axis4.severity },
            { axis: '轴V', diagnosis: `GAF=${form.axis5.currentGAF}（当前）`, severity: form.axis5.period }
          ]" border>
            <el-table-column prop="axis" label="轴系" width="80" />
            <el-table-column prop="diagnosis" label="诊断编码与名称" />
            <el-table-column prop="severity" label="严重程度" />
          </el-table>
        </div>

        <div class="symptoms-section">
          <h3>二、转诊依据</h3>
          <h4>临床症状：</h4>
          <ul>
            <li>{{ form.clinicalSymptoms.mood }}</li>
            <li>{{ form.clinicalSymptoms.rhythm }}</li>
            <li>{{ form.clinicalSymptoms.suicide }}</li>
          </ul>
          
          <h4>风险等级：</h4>
          <ul>
            <li><strong>自杀风险：</strong>{{ form.riskAssessment.suicideRisk }}</li>
            <li><strong>暴力风险：</strong>{{ form.riskAssessment.violenceRisk }}</li>
          </ul>
          
          <h4>初步干预效果：</h4>
          <ul>
            <li>{{ form.interventionEffect.counseling }}</li>
            <li>{{ form.interventionEffect.academic }}</li>
          </ul>
        </div>

        <div class="auxiliary-section">
          <h3>三、已收集的辅助资料</h3>
          <h4>数字化行为数据（附光盘）：</h4>
          <ul>
            <li>{{ form.auxiliaryData.digitalBehavior.sleep }}</li>
            <li>{{ form.auxiliaryData.digitalBehavior.activity }}</li>
          </ul>
          
          <h4>实验室检查：</h4>
          <ul>
            <li>{{ form.auxiliaryData.labTests.thyroid }}</li>
            <li>{{ form.auxiliaryData.labTests.blood }}</li>
          </ul>
          
          <h4>量表报告：</h4>
          <ul>
            <li v-for="scale in form.auxiliaryData.scales" :key="scale">{{ scale }}</li>
          </ul>
        </div>

        <div class="purpose-section">
          <h3>四、转诊目的与建议</h3>
          <h4>进一步评估：</h4>
          <ul>
            <li v-for="assessment in form.referralPurpose.furtherAssessment" :key="assessment">{{ assessment }}</li>
          </ul>
          
          <h4>治疗建议：</h4>
          <p>{{ form.referralPurpose.treatmentRecommendation }}（推荐等级：{{ form.referralPurpose.recommendationLevel }}）</p>
          
          <h4>建议联合治疗方案：</h4>
          <ol>
            <li><strong>药物治疗：</strong>{{ form.referralPurpose.treatmentPlan.medication }}</li>
            <li><strong>心理治疗：</strong>{{ form.referralPurpose.treatmentPlan.psychotherapy }}</li>
            <li><strong>物理治疗：</strong>{{ form.referralPurpose.treatmentPlan.physicalTherapy }}</li>
          </ol>
          
          <h4>特殊注意事项：</h4>
          <ul>
            <li v-for="note in form.specialNotes" :key="note">{{ note }}</li>
          </ul>
        </div>

        <div class="doctor-section">
          <h3>五、医师声明</h3>
          <p><strong>转诊医师：</strong>{{ form.doctorInfo.name }}（执业证号：{{ form.doctorInfo.licenseNumber }}）</p>
          <p><strong>声明：</strong></p>
          <p>{{ form.doctorInfo.declaration }}</p>
          
          <div class="signature-section">
            <p><strong>签署：</strong></p>
            <p>（医师签名）__________________</p>
            <p>（机构公章）</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.referral-suggestion {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.referral-form {
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

.form-actions {
  text-align: center;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e4e7ed;
}

.form-actions .el-button {
  margin: 0 10px;
}

/* 预览样式 */
.referral-preview {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

.preview-header h2 {
  color: #409eff;
  margin: 0;
  font-size: 24px;
}

.preview-actions .el-button {
  margin-left: 10px;
}

.referral-content {
  line-height: 1.8;
}

.basic-info {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.basic-info p {
  margin: 5px 0;
}

.diagnosis-section,
.symptoms-section,
.auxiliary-section,
.purpose-section,
.doctor-section {
  margin-bottom: 30px;
}

.diagnosis-section h3,
.symptoms-section h3,
.auxiliary-section h3,
.purpose-section h3,
.doctor-section h3 {
  color: #409eff;
  border-bottom: 1px solid #409eff;
  padding-bottom: 5px;
  margin-bottom: 15px;
}

.diagnosis-section h4,
.symptoms-section h4,
.auxiliary-section h4,
.purpose-section h4 {
  color: #606266;
  margin: 15px 0 10px 0;
  font-size: 16px;
}

.signature-section {
  margin-top: 30px;
  text-align: center;
}

.signature-section p {
  margin: 10px 0;
}

@media print {
  .preview-header {
    display: none;
  }
  
  .referral-preview {
    box-shadow: none;
    padding: 20px;
  }
}
</style> 