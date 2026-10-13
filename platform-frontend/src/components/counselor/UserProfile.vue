<script setup>
import { ref } from 'vue'

// 示例学生画像数据
const profile = ref({
  studentName: '张××',
  gender: '男',
  age: 20,
  studentId: '20230517',
  school: '××大学心理学院',
  behavior: {
    sleep: '平均入睡时间03:21，睡眠效率68%',
    activity: '近1月图书馆访问次数0次',
    lateReturn: '宿舍晚归记录频繁（近1月超过15次）'
  },
  academic: {
    attendance: '出勤率低于20%',
    exam: '考试焦虑，成绩波动大',
    library: '图书馆借阅记录显示学习兴趣下降'
  },
  emotion: {
    mood: '情绪低落，兴趣减退',
    anxiety: '社交场合紧张，回避集体活动',
    selfHarm: '存在被动自杀意念，无具体计划'
  },
  social: {
    peer: '与同学关系疏远，缺乏支持',
    family: '家庭沟通较少，支持有限',
    group: '未参加团体心理活动'
  },
  summary: '学生近期学业压力大，情绪波动明显，行为上出现晚归、缺勤等问题，建议加强心理支持与学业辅导。'
})
</script>

<template>
  <div class="counselor-user-profile">
    <h2>学生画像</h2>
    <el-descriptions :column="3" border>
      <el-descriptions-item label="姓名">{{ profile.studentName }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{ profile.gender }}</el-descriptions-item>
      <el-descriptions-item label="年龄">{{ profile.age }}岁</el-descriptions-item>
      <el-descriptions-item label="学号">{{ profile.studentId }}</el-descriptions-item>
      <el-descriptions-item label="学院">{{ profile.school }}</el-descriptions-item>
    </el-descriptions>

    <div class="profile-section">
      <h3>行为数据</h3>
      <ul>
        <li>睡眠：{{ profile.behavior.sleep }}</li>
        <li>活动：{{ profile.behavior.activity }}</li>
        <li>晚归：{{ profile.behavior.lateReturn }}</li>
      </ul>
    </div>
    <div class="profile-section">
      <h3>学业数据</h3>
      <ul>
        <li>出勤：{{ profile.academic.attendance }}</li>
        <li>考试：{{ profile.academic.exam }}</li>
        <li>图书馆：{{ profile.academic.library }}</li>
      </ul>
    </div>
    <div class="profile-section">
      <h3>情绪数据</h3>
      <ul>
        <li>情绪：{{ profile.emotion.mood }}</li>
        <li>焦虑：{{ profile.emotion.anxiety }}</li>
        <li>自伤风险：{{ profile.emotion.selfHarm }}</li>
      </ul>
    </div>
    <div class="profile-section">
      <h3>社交数据</h3>
      <ul>
        <li>同伴关系：{{ profile.social.peer }}</li>
        <li>家庭支持：{{ profile.social.family }}</li>
        <li>团体活动：{{ profile.social.group }}</li>
      </ul>
    </div>
    <div class="profile-section">
      <h3>综合画像分析</h3>
      <el-alert :title="profile.summary" type="info" show-icon />
    </div>
  </div>
</template>

<style scoped>
.counselor-user-profile {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.08);
  max-width: 900px;
  margin: 30px auto;
}
.counselor-user-profile h2 {
  color: #67c23a;
  margin-bottom: 20px;
}
.profile-section {
  margin: 30px 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #e4e7ed;
}
.profile-section:last-child {
  border-bottom: none;
}
.profile-section h3 {
  color: #409eff;
  margin-bottom: 10px;
}
ul {
  margin: 0;
  padding-left: 20px;
}
li {
  margin: 6px 0;
  color: #606266;
}
</style> 