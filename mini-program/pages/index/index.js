// pages/index/index.js
const app = getApp()

Page({
    data: {
        currentDate: '',
        userType: '',
        userName: '',
        students: []
      },

      onLoad() {
        const app = getApp();
        const date = new Date();
        const userType = app.globalData.userType;
        
        // 学生身份不得进入此页面
        if (userType === 'student') {
          wx.reLaunch({
            url: '/pages/advice/advice'
          });
          return;
        }
        
        this.setData({
          currentDate: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
          userType: userType,
          userName: wx.getStorageSync('userName') || (userType === 'parent' ? '家长' : '辅导员')
        });
        
        this.loadStudents();
      },

  loadStudents() {
    // 模拟数据 - 实际应从后端API获取
    const mockData = {
      parent: [
        {
          id: 's001',
          name: '张晓明',
          class: '三年级二班',
          avatar: '/images/avatar1.png',
          status: '良好',
          lastEvaluation: '2023-05-15'
        }
      ],
      counselor: [
        {
          id: 's001',
          name: '张晓明',
          class: '三年级二班',
          avatar: '/images/avatar1.png',
          status: '良好',
          lastEvaluation: '2023-05-15'
        },
        {
          id: 's002',
          name: '李华',
          class: '四年级一班',
          avatar: '/images/avatar2.png',
          status: '需关注',
          lastEvaluation: '2023-05-10'
        },
        {
          id: 's003',
          name: '王芳',
          class: '五年级三班',
          avatar: '/images/avatar3.png',
          status: '正常',
          lastEvaluation: '2023-05-12'
        }
      ]
    }
    
    this.setData({
      students: mockData[app.globalData.userType]
    })
  },

  getStatusClass(status) {
    const map = {
      '良好': 'good',
      '正常': 'normal',
      '需关注': 'concern',
      '预警': 'warning'
    }
    return map[status] || 'normal'
  },

  viewDetail(e) {
    const id = e.currentTarget.dataset.id
    const student = this.data.students.find(s => s.id === id)
    app.globalData.currentStudent = student
    
    wx.navigateTo({
      url: '/pages/detail/detail'
    })
  }
})