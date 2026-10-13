const app = getApp();

Page({
  data: {
    newComment: "", // 新评论内容
    commentLength: 0, // 评论长度
  },

  onCommentInput(e) {
    const content = e.detail.value;
    this.setData({
      newComment: content,
      commentLength: content.length
    });
  },
  
  submitComment() {
    const content = this.data.newComment.trim();
    if (!content) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      });
      return;
    }
    
    if (content.length > 200) {
      wx.showToast({
        title: '评论内容不能超过200字',
        icon: 'none'
      });
      return;
    }
    
    wx.showToast({
      title: '评论提交成功',
      icon: 'success'
    });
    
    // 重置输入框
    this.setData({
      newComment: '',
      commentLength: 0
    });
  },
  
  viewAllComments() {
    wx.navigateTo({
      url: '/pages/comments/comments'
    });
  }
});