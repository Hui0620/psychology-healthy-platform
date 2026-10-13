// pages/comments/comments.js
const app = getApp()

Page({
  data: {
    studentId: '',
    studentName: '',
    comments: []    // 历史评论列表
  },

  onLoad(options) {
    // 从路由参数获取学生ID和姓名
    const { studentId, studentName } = options;
    if (!studentId) return wx.navigateBack();
    
    this.setData({ studentId, studentName });
    this.loadComments(studentId);
  },

  // 加载评论数据
  loadComments(studentId) {
    // 从本地缓存获取评论数据
    const comments = wx.getStorageSync('mentalHealthComments') || {};
    
    // 获取当前学生的评论列表，按时间倒序
    const studentComments = comments[studentId] || [];
    studentComments.sort((a, b) => b.timestamp - a.timestamp);
    
    this.setData({ comments: studentComments });
  },

  // 评论输入事件处理
  onCommentInput(e) {
    this.setData({
      newComment: e.detail.value
    });
  },

  // 提交评论
  submitComment() {
    const { newComment, studentId } = this.data;
    if (!newComment.trim()) return;
    
    const comment = {
      content: newComment.trim(),
      timestamp: Date.now(),
      status: 'pending' // 默认状态为审核中
    };
    
    // 获取所有评论
    const allComments = wx.getStorageSync('mentalHealthComments') || {};
    
    // 更新当前学生的评论列表
    const studentComments = allComments[studentId] || [];
    studentComments.push(comment);
    allComments[studentId] = studentComments;
    
    // 保存到本地缓存
    wx.setStorageSync('mentalHealthComments', allComments);
    
    // 更新UI
    this.setData({
      newComment: '',
      comments: [...studentComments].sort((a, b) => b.timestamp - a.timestamp)
    });
    
    wx.showToast({
      title: '评论提交成功，等待审核',
      icon: 'success'
    });
  },

  // 格式化时间显示
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
});