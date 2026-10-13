App({
    globalData: {
      userType: null, // 'parent', 'counselor' 或 'student'
      currentStudent: null
    },
    
    onLaunch() {
      // 检查登录状态
      wx.checkSession({
        success: () => {
          const userType = wx.getStorageSync('userType');
          if (userType) {
            this.globalData.userType = userType;
            if (userType === 'student') {
              wx.reLaunch({
                url: '/pages/advice/advice'
              });
            } else {
              wx.reLaunch({
                url: '/pages/index/index'
              });
            }
          }
        },
        fail: () => {
          // 会话过期
          wx.removeStorageSync('userType');
        }
      });
    }
  });