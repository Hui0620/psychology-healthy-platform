<script setup>
import { ref, reactive, onMounted } from 'vue'
import * as echarts from 'echarts/core'
import { GridComponent, TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { LineChart, BarChart, RadarChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

echarts.use([TitleComponent, GridComponent, TooltipComponent, LegendComponent, LineChart, BarChart, RadarChart, CanvasRenderer, UniversalTransition])

const diagnosisForm = reactive({
  patientName: '',
  patientId: '',
  symptoms: '',
  testResults: '',
  aiAnalysis: ''
})

// 模型配置数据
const modelCategories = [
  {
    name: '本地模型',
    models: [
      {
        type: 'CNN + LSTM',
        agencies: [
          '**大学心理中心'
        ],
        accuracy: '89.5%',
        evaluate: '优秀',
        createDate: '2024-01-15'
      },
      {
        type: 'ResNet + Attention',
        agencies: [
          '**大学心理中心'
        ],
        accuracy: '87.8%',
        evaluate: '良好',
        createDate: '2024-02-20'
      }
    ]
  },
  {
    name: '全局模型',
    models: [
      {
        type: 'Transformer + BERT',
        agencies: [
          '**医科大学附属医院',
          '**大学心理咨询中心',
          '**市精神卫生中心',
          '**师范大学教育学院',
          '**医学院心理系'
        ],
        accuracy: '92.3%',
        evaluate: '卓越',
        createDate: '2024-03-10'
      }
    ]
  },
  {
    name: '个性化模型',
    models: [
      {
        type: 'CNN + LSTM',
        agencies: [
          '**大学心理中心',
          '**医院精神科',
          '**市第一人民医院',
          '**师范大学心理学院',
          '**医学院附属医院'
        ],
        accuracy: '94.1%',
        evaluate: '卓越',
        createDate: '2024-04-05'
      },
      {
        type: 'Transformer + BERT',
        agencies: [
          '**医科大学附属医院',
          '**大学心理咨询中心',
          '**市精神卫生中心',
          '**师范大学教育学院',
          '**医学院心理系'
        ],
        accuracy: '93.7%',
        evaluate: '卓越',
        createDate: '2024-04-12'
      }
    ]
  }
]

const selectedCategoryIndex = ref(0)
const selectedModelIndex = ref(0)

const model = reactive({
  type: modelCategories[0].models[0].type,
  accuracy: modelCategories[0].models[0].accuracy,
  createDate: modelCategories[0].models[0].createDate
})

const chartRef = ref(null)
const radarChartRef = ref(null)
const isLoading = ref(false)

const aiSuggestions = ref([
  '根据症状分析，建议进行进一步的心理评估',
  '可能需要专业的心理咨询师介入',
  '建议定期进行心理健康检查'
])

onMounted(() => {
  initCharts()
})

function initCharts() {
  // 初始化准确度曲线图
  const myChart = echarts.init(chartRef.value)
  let option = {
    title: {
      text: 'AI诊断模型准确度趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
    },
    yAxis: {
      type: 'value',
      min: 70,
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '准确度',
        data: [78, 83, 88, 76, 89, 92, 89.5],
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#409eff'
        },
        itemStyle: {
          color: '#409eff'
        }
      }
    ]
  }
  myChart.setOption(option)

  // 初始化雷达图
  const radarChart = echarts.init(radarChartRef.value)
  let radarOption = {
    title: {
      text: '多维度评估雷达图',
      left: 'center'
    },
    radar: {
      indicator: [
        { name: '抑郁倾向', max: 100 },
        { name: '焦虑水平', max: 100 },
        { name: '社交能力', max: 100 },
        { name: '学业压力', max: 100 },
        { name: '睡眠质量', max: 100 },
        { name: '情绪稳定性', max: 100 }
      ]
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [75, 68, 45, 82, 35, 60],
            name: '当前评估',
            areaStyle: {
              color: 'rgba(64, 158, 255, 0.3)'
            },
            lineStyle: {
              color: '#409eff'
            }
          }
        ]
      }
    ]
  }
  radarChart.setOption(radarOption)
}



const router = useRouter()

function generateAIAnalysis() {
  isLoading.value = true
  setTimeout(() => {
    ElMessage.success('AI分析完成，正在跳转到评估报告...')
    isLoading.value = false
    router.push('/index/ai-report')
  }, 3000)
}



function resetForm() {
  diagnosisForm.patientName = ''
  diagnosisForm.patientId = ''
  diagnosisForm.symptoms = ''
  diagnosisForm.testResults = ''
  diagnosisForm.aiAnalysis = ''
}

function onCategoryChange(index) {
  selectedCategoryIndex.value = index
  selectedModelIndex.value = 0 // 重置模型选择
  updateModelInfo()
}

function onModelChange(index) {
  selectedModelIndex.value = index
  updateModelInfo()
}

function updateModelInfo() {
  const currentCategory = modelCategories[selectedCategoryIndex.value]
  const currentModel = currentCategory.models[selectedModelIndex.value]
  
  model.type = currentModel.type
  model.accuracy = currentModel.accuracy
  model.createDate = currentModel.createDate
}
</script>

<template>
  <div class="diagnosis" v-loading="isLoading" element-loading-text="AI分析中，请稍等...">
    <div class="diagnosis-container">
      <!-- 模型信息区域 -->
      <div class="model-info">
        <div class="model-selection">
          <h3>四、个性化干预方案</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="模型分类">
                <el-select 
                  v-model="selectedCategoryIndex" 
                  @change="onCategoryChange"
                  placeholder="请选择模型分类"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(category, index) in modelCategories"
                    :key="index"
                    :label="category.name"
                    :value="index"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="模型类型">
                <el-select 
                  v-model="selectedModelIndex" 
                  @change="onModelChange"
                  placeholder="请选择模型类型"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(modelOption, index) in modelCategories[selectedCategoryIndex].models"
                    :key="index"
                    :label="modelOption.type"
                    :value="index"
                  >
                    <span>{{ modelOption.type }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      准确度: {{ modelOption.accuracy }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
        </div>
        
        <div class="writer">
          <div style="display: flex; justify-content: space-between;">
            <span style="width: 30vw">当前模型类型：{{ model.type }}</span>
            <span style="width: 30vw">模型创建日期：{{ model.createDate }}</span>
            <span style="width: 30vw">模型准确度：{{ model.accuracy }}</span>
          </div>
          <div style="margin-top: 20px; display: flex; justify-content: center; align-items: center;">
            <div style="font-weight: bold; color: #409eff; margin-right: 20px; min-width: 80px;">参与机构：</div>
            <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
              <el-tag 
                v-for="(agency, index) in modelCategories[selectedCategoryIndex].models[selectedModelIndex].agencies" 
                :key="index"
                type="info"
                effect="plain"
                size="large"
                style="font-size: 16px; padding: 8px 15px; border-radius: 6px;"
              >
                {{ agency }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 图表区域 -->
      <div class="charts-section">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="chart-container">
              <div ref="chartRef" class="chart"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-container">
              <div ref="radarChartRef" class="chart"></div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-divider />





      <!-- 操作按钮区域 -->
      <div class="action-buttons">
        <el-button type="primary" size="large" @click="generateAIAnalysis" :loading="isLoading">
          AI智能分析
        </el-button>
        <el-button size="large" @click="resetForm">
          重置表单
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diagnosis {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 55px);
}

.diagnosis-container {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.model-info {
  margin-bottom: 20px;
}

.model-selection {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.model-selection h3 {
  color: #409eff;
  margin-bottom: 20px;
  font-size: 18px;
  text-align: center;
}

.writer {
  text-align: center;
  font-size: 18px;
  font-family: 楷体, serif;
  padding: 20px 0;
}

.charts-section {
  margin: 30px 0;
}

.chart-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
}



.action-buttons {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.action-buttons .el-button {
  margin: 0 10px;
  min-width: 120px;
}

.dark .diagnosis {
  background-color: #1f2023;
}

.dark .diagnosis-container {
  background-color: #2b2b2b;
  color: #ffffff;
}

.dark .model-selection {
  background-color: #2b2b2b;
  border-color: #4c4c4c;
}

.dark .chart-container {
  background-color: #2b2b2b;
}



.dark .action-buttons {
  border-top-color: #4c4c4c;
}
</style> 