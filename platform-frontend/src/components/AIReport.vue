<script setup>
import { ref, onMounted, computed } from 'vue'
import * as echarts from 'echarts/core'
import { GridComponent, TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { LineChart, BarChart, RadarChart, PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TitleComponent, GridComponent, TooltipComponent, LegendComponent, LineChart, BarChart, RadarChart, PieChart, CanvasRenderer, UniversalTransition])

const reportData = ref({
  basicInfo: {
    name: '张××',
    studentId: '20230517',
    gender: '男',
    age: 20,
    assessmentDate: '2023-11-25',
    assessmentPeriod: '2023-09-01至2023-11-25'
  },
  riskLevel: {
    overall: '中度',
    depression: '重度',
    anxiety: '中度',
    socialAdaptation: '重度缺陷'
  },
  emotionAssessment: {
    phq9Score: 21,
    emotionFluctuation: 4.2,
    voiceDeviation: 78,
    morningEveningRatio: 42,
    speechRate: -32,
    pauseIncrease: 210,
    suicideRisk: '被动意念（3/5），无具体计划'
  },
  anxietyAssessment: {
    backRowRate: 89,
    classAverage: 31,
    skinResponse: 12.8,
    baseline: 3.5
  },
  stressSources: [
    { name: '学业压力', value: 65 },
    { name: '家庭期望', value: 20 },
    { name: '人际关系', value: 10 },
    { name: '经济压力', value: 5 }
  ],
  socialAdaptation: {
    offlineInteraction: 2,
    healthyBaseline: 5,
    wechatDelay: 8.7,
    healthyDelay: 2,
    groupActivity: 0,
    healthyActivity: 2
  }
})

const socialTableData = computed(() => [
  { 
    indicator: '线下互动人数', 
    current: reportData.value.socialAdaptation.offlineInteraction + '人', 
    baseline: '≥' + reportData.value.socialAdaptation.healthyBaseline + '人' 
  },
  { 
    indicator: '微信回复延迟', 
    current: reportData.value.socialAdaptation.wechatDelay + 'h', 
    baseline: '<' + reportData.value.socialAdaptation.healthyDelay + 'h' 
  },
  { 
    indicator: '团体活动参与', 
    current: reportData.value.socialAdaptation.groupActivity + '次/月', 
    baseline: '≥' + reportData.value.socialAdaptation.healthyActivity + '次' 
  }
])

const interventionTableData = computed(() => [
  { module: '行为激活', plan: '每日强制户外光照≥30分钟（手环监控）', period: '4周' },
  { module: '社交重建', plan: '匹配"编程学习伙伴"（系统筛选低攻击性）', period: '12周' },
  { module: '认知重构', plan: 'VR模拟答辩场景（暴露层级L2→L4）', period: '8周' }
])

let emotionChart = null
let stressChart = null
let socialChart = null
let trendChart = null

onMounted(() => {
  initCharts()
})

function initCharts() {
  // 情绪评估雷达图
  const emotionChartDom = document.getElementById('emotionChart')
  if (emotionChartDom) {
    emotionChart = echarts.init(emotionChartDom)
    const emotionOption = {
      title: {
        text: '情绪状态评估',
        left: 'center',
        textStyle: {
          color: '#409eff',
          fontSize: 16
        }
      },
      radar: {
        indicator: [
          { name: 'PHQ-9总分', max: 27 },
          { name: '情绪波动', max: 6 },
          { name: '语音偏离度', max: 100 },
          { name: '晨重暮轻', max: 50 },
          { name: '语速变化', max: 50 }
        ],
        radius: '60%'
      },
      series: [{
        type: 'radar',
        data: [{
          value: [21, 4.2, 78, 42, 32],
          name: '当前状态',
          areaStyle: {
            color: 'rgba(255, 99, 132, 0.3)'
          },
          lineStyle: {
            color: '#ff6384'
          }
        }]
      }]
    }
    emotionChart.setOption(emotionOption)
  }

  // 压力源饼图
  const stressChartDom = document.getElementById('stressChart')
  if (stressChartDom) {
    stressChart = echarts.init(stressChartDom)
    const stressOption = {
      title: {
        text: '压力源构成比',
        left: 'center',
        textStyle: {
          color: '#409eff',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}%'
      },
      series: [{
        name: '压力源',
        type: 'pie',
        radius: '60%',
        data: reportData.value.stressSources,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
    stressChart.setOption(stressOption)
  }

  // 社交适应性柱状图
  const socialChartDom = document.getElementById('socialChart')
  if (socialChartDom) {
    socialChart = echarts.init(socialChartDom)
    const socialOption = {
      title: {
        text: '社交适应性对比',
        left: 'center',
        textStyle: {
          color: '#409eff',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['当前值', '健康基准'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: ['线下互动人数', '微信回复延迟(h)', '团体活动(次/月)']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '当前值',
        type: 'bar',
        data: [2, 8.7, 0],
        itemStyle: {
          color: '#ff6384'
        }
      }, {
        name: '健康基准',
        type: 'bar',
        data: [5, 2, 2],
        itemStyle: {
          color: '#36a2eb'
        }
      }]
    }
    socialChart.setOption(socialOption)
  }

  // 焦虑趋势图
  const trendChartDom = document.getElementById('trendChart')
  if (trendChartDom) {
    trendChart = echarts.init(trendChartDom)
    const trendOption = {
      title: {
        text: '焦虑水平趋势',
        left: 'center',
        textStyle: {
          color: '#409eff',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周']
      },
      yAxis: {
        type: 'value',
        name: 'GAD-7评分'
      },
      series: [{
        name: 'GAD-7周均值',
        type: 'line',
        data: [8, 10, 12, 15, 14, 16, 18, 17],
        smooth: true,
        lineStyle: {
          color: '#36a2eb',
          width: 3
        },
        areaStyle: {
          color: 'rgba(54, 162, 235, 0.2)'
        }
      }]
    }
    trendChart.setOption(trendOption)
  }
}
</script>

<template>
  <div class="ai-report">
    <div class="report-container">
      <!-- 报告头部 -->
      <div class="report-header">
        <h1>大学生心理状态智能评估报告</h1>
        <div class="basic-info">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="info-item">
                <span class="label">姓名：</span>
                <span class="value">{{ reportData.basicInfo.name }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <span class="label">学号：</span>
                <span class="value">{{ reportData.basicInfo.studentId }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <span class="label">性别：</span>
                <span class="value">{{ reportData.basicInfo.gender }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <span class="label">年龄：</span>
                <span class="value">{{ reportData.basicInfo.age }}岁</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;">
            <el-col :span="12">
              <div class="info-item">
                <span class="label">评估时间：</span>
                <span class="value">{{ reportData.basicInfo.assessmentDate }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <span class="label">评估周期：</span>
                <span class="value">{{ reportData.basicInfo.assessmentPeriod }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 核心风险等级 -->
      <div class="risk-section">
        <h2>一、核心风险等级</h2>
        <div class="risk-card">
          <div class="risk-level">
            <span class="risk-label">综合风险：</span>
            <span class="risk-value moderate">{{ reportData.riskLevel.overall }}</span>
          </div>
          <div class="risk-details">
            <p><strong>判定依据：</strong>{{ reportData.riskLevel.depression }} + {{ reportData.riskLevel.anxiety }} + {{ reportData.riskLevel.socialAdaptation }}</p>
            <div class="risk-indicators">
              <div class="indicator-item">
                <span class="indicator-label">抑郁程度：</span>
                <span class="indicator-value high">{{ reportData.riskLevel.depression }}</span>
              </div>
              <div class="indicator-item">
                <span class="indicator-label">焦虑程度：</span>
                <span class="indicator-value medium">{{ reportData.riskLevel.anxiety }}</span>
              </div>
              <div class="indicator-item">
                <span class="indicator-label">社会适应：</span>
                <span class="indicator-value high">{{ reportData.riskLevel.socialAdaptation }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分维度评估 -->
      <div class="assessment-section">
        <h2>二、分维度评估结果</h2>
        
        <!-- 情绪状态评估 -->
        <div class="assessment-card">
          <h3>1. 情绪状态评估</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="chart-wrapper">
                <div id="emotionChart" class="chart"></div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="data-table">
                <el-table :data="[
                  { indicator: 'PHQ-9总分', value: reportData.emotionAssessment.phq9Score + '/27', range: '0-4', risk: '●●●●●' },
                  { indicator: '情绪波动频率', value: reportData.emotionAssessment.emotionFluctuation + '次/日', range: '<1.5', risk: '●●●●○' },
                  { indicator: '语音情感偏离度', value: reportData.emotionAssessment.voiceDeviation + '%', range: '<30%', risk: '●●●●●' }
                ]" style="width: 100%">
                  <el-table-column prop="indicator" label="评估指标" />
                  <el-table-column prop="value" label="数值" />
                  <el-table-column prop="range" label="参考范围" />
                  <el-table-column prop="risk" label="风险等级" />
                </el-table>
              </div>
              <div class="key-findings">
                <h4>关键发现：</h4>
                <ul>
                  <li>存在晨重暮轻节律（晨间抑郁评分比晚间高{{ reportData.emotionAssessment.morningEveningRatio }}%）</li>
                  <li>语音分析显示：语速减慢（↓{{ Math.abs(reportData.emotionAssessment.speechRate) }}%）、停顿增多（↑{{ reportData.emotionAssessment.pauseIncrease }}%）</li>
                  <li>自杀风险评估：{{ reportData.emotionAssessment.suicideRisk }}</li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 焦虑水平评估 -->
        <div class="assessment-card">
          <h3>2. 焦虑水平评估</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="chart-wrapper">
                <div id="trendChart" class="chart"></div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="behavior-features">
                <h4>行为特征：</h4>
                <div class="feature-item">
                  <span class="feature-label">课堂回避行为：</span>
                  <span class="feature-value">后排就坐率{{ reportData.anxietyAssessment.backRowRate }}%（班级平均{{ reportData.anxietyAssessment.classAverage }}%）</span>
                </div>
                <div class="feature-item">
                  <span class="feature-label">考试周皮肤电反应：</span>
                  <span class="feature-value">峰值达{{ reportData.anxietyAssessment.skinResponse }}μS（基线{{ reportData.anxietyAssessment.baseline }}μS）</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 压力源分析 -->
        <div class="assessment-card">
          <h3>3. 压力源分析</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="chart-wrapper">
                <div id="stressChart" class="chart"></div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="stress-events">
                <h4>典型压力事件：</h4>
                <ul>
                  <li>11/15 数据库课程项目截止前48小时，连续清醒时间达37小时</li>
                  <li>父亲每周2次询问"保研准备进度"（通话录音情感分析显示压力↑58%）</li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 社会适应性评估 -->
        <div class="assessment-card">
          <h3>4. 社会适应性评估</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="chart-wrapper">
                <div id="socialChart" class="chart"></div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="social-data">
                <el-table :data="socialTableData" style="width: 100%">
                  <el-table-column prop="indicator" label="社交指标" />
                  <el-table-column prop="current" label="当前值" />
                  <el-table-column prop="baseline" label="健康基准" />
                </el-table>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>



      <!-- 干预方案 -->
      <div class="intervention-section">
        <h2>三、个性化干预方案</h2>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="intervention-card emergency">
              <h3>紧急措施</h3>
              <ul>
                <li>教务协调：立即暂停《机器学习》课程（当前挂科风险92%）</li>
                <li>药物评估：建议SSRI类（艾司西酞普兰10mg起始）</li>
              </ul>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="intervention-card long-term">
              <h3>中长期计划</h3>
              <el-table :data="interventionTableData" style="width: 100%">
                <el-table-column prop="module" label="模块" />
                <el-table-column prop="plan" label="具体方案" />
                <el-table-column prop="period" label="预期周期" />
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 评估结论 -->
      <div class="conclusion-section">
        <h2>评估结论</h2>
        <div class="conclusion-card">
          <p>该学生存在明显的抑郁和焦虑症状，社会适应能力严重不足，建议立即启动危机干预程序，同时进行药物治疗和心理咨询。</p>
          <div class="confidence">
            <span class="confidence-label">模型置信度：</span>
            <span class="confidence-value">89.5%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-report {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.report-container {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 1400px;
  margin: 0 auto;
}

.report-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 2px solid #e4e7ed;
}

.report-header h1 {
  color: #409eff;
  font-size: 28px;
  margin-bottom: 20px;
  font-weight: bold;
}

.basic-info {
  margin-top: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.info-item .label {
  color: #606266;
  font-weight: 500;
  min-width: 80px;
  margin-right: 10px;
}

.info-item .value {
  color: #303133;
  font-weight: bold;
}

.risk-section, .assessment-section, .intervention-section, .conclusion-section {
  margin-bottom: 40px;
  margin-top: 40px;
  padding-top: 20px;
}

.risk-section h2, .assessment-section h2, .intervention-section h2 {
  color: #409eff;
  font-size: 22px;
  margin-bottom: 20px;
  padding-left: 15px;
  border-left: 4px solid #409eff;
}

.conclusion-section h2 {
  color: #409eff;
  font-size: 22px;
  margin-bottom: 20px;
  margin-top: 20px;
  padding-left: 15px;
  border-left: 4px solid #409eff;
}

.risk-card {
  background-color: #f8f9fa;
  color: #303133;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #e4e7ed;
}

.risk-level {
  margin-bottom: 15px;
}

.risk-label {
  font-size: 18px;
  font-weight: 500;
}

.risk-value {
  font-size: 32px;
  font-weight: bold;
  margin-left: 10px;
}

.risk-value.moderate {
  color: #ffd700;
}

.risk-details {
  margin-top: 15px;
}

.risk-details p {
  margin: 0;
  font-size: 16px;
}

.risk-indicators {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.indicator-item {
  text-align: center;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  margin: 5px;
  min-width: 120px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.indicator-label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
  color: #606266;
}

.indicator-value {
  display: block;
  font-size: 18px;
  font-weight: bold;
}

.indicator-value.high {
  color: #ff4757;
}

.indicator-value.medium {
  color: #ffa502;
}

.indicator-value.low {
  color: #2ed573;
}

.assessment-card {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  border: 1px solid #e4e7ed;
}

.assessment-card h3 {
  color: #409eff;
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
}

.chart-wrapper {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart {
  width: 100%;
  height: 300px;
}

.data-table {
  margin-bottom: 20px;
}

.key-findings h4, .behavior-features h4, .stress-events h4 {
  color: #409eff;
  margin-bottom: 15px;
}

.key-findings ul, .stress-events ul {
  padding-left: 20px;
}

.key-findings li, .stress-events li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.feature-item {
  margin-bottom: 15px;
  padding: 10px;
  background-color: white;
  border-radius: 6px;
  border-left: 4px solid #409eff;
}

.feature-label {
  font-weight: bold;
  color: #409eff;
}

.feature-value {
  margin-left: 10px;
  color: #606266;
}



.intervention-card {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  height: 100%;
  border: 1px solid #e4e7ed;
}

.intervention-card.emergency {
  border-left: 4px solid #ff6b6b;
}

.intervention-card.long-term {
  border-left: 4px solid #4caf50;
}

.intervention-card h3 {
  color: #409eff;
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
}

.intervention-card ul {
  padding-left: 20px;
}

.intervention-card li {
  margin-bottom: 10px;
  line-height: 1.6;
}



.conclusion-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
}

.conclusion-card p {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 20px;
}

.confidence {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.confidence-label {
  font-size: 16px;
}

.confidence-value {
  font-size: 24px;
  font-weight: bold;
  color: #ffd700;
}

/* 深色模式 */
.dark .ai-report {
  background-color: #1f2023;
}

.dark .report-container {
  background-color: #2b2b2b;
  color: #ffffff;
}

.dark .assessment-card {
  background-color: #2b2b2b;
  border-color: #4c4c4c;
}

.dark .chart-wrapper {
  background-color: #2b2b2b;
}

.dark .intervention-card {
  background-color: #2b2b2b;
  border-color: #4c4c4c;
}

.dark .info-item .label {
  color: #b0b0b0;
}

.dark .info-item .value {
  color: #ffffff;
}
</style> 