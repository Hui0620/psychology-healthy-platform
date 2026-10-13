// pages/questionnaire/questionnaire.js
Page({
    data: {
      hasCompletedTest: false
    },
  
    onLoad() {
      // 从本地存储获取完成状态
      const hasCompletedTest = wx.getStorageSync('hasCompletedTest') || false;
      this.setData({ hasCompletedTest });
    },
  
    navigateBack() {
      wx.navigateBack();
    },
  
    // 开始问卷
    startQuestionnaire(e) {
      const id = e.currentTarget.dataset.id;
      console.log('开始问卷', id);
      
      // 检查是否已完成
      if (this.data.hasCompletedTest) {
        wx.showModal({
          title: '已完成测评',
          content: '您已经完成过心理测评，是否要重新测试？',
          confirmText: '重新测评',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              // 重置完成状态
              wx.setStorageSync('hasCompletedTest', false);
              this.setData({ hasCompletedTest: false });
              // 跳转到问卷详情页
              wx.navigateTo({
                url: `/pages/questionnaire_detail/questionnaire_detail?id=${id}`
              });
            }
          }
        });
      } else {
        // 直接跳转
        wx.navigateTo({
          url: `/pages/questionnaire_detail/questionnaire_detail?id=${id}`
        });
      }
    }
  });