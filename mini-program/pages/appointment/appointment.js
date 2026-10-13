// 预约医生页面
Page({
    data: {
      // 可以添加医生数据
    },
    
    onLoad() {
      // 页面加载
    },
    
    navigateBack() {
      wx.navigateBack();
    },
    
    bookDoctor(e) {
      const doctorId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/appointment_detail/appointment_detail?doctorId=${doctorId}`
      });
    }
  });