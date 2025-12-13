Page({
  // 拨打电话事件
  handleCall() {
    wx.makePhoneCall({
      phoneNumber: '18123283975',
    })
  }
})