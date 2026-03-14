import { BASE_URL } from '../../config.js';

Page({
  data: {
    product_code: '',
    product_type: '',
    product: {},
    img_list: [],
  },

  onLoad(options) {
    // const type = options.product_type;
    this.setData({
      product_code: options.product_code,
      product_type: options.product_type,
    });
    // const item_code = options.product_code;
    this.Load_Product();
  },

  // 预览大图
  previewImage(e) {
    const current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.img_list,
    })
  },

  // 跳转联系销售
  jumpToSales() {
    wx.navigateTo({
      url: '/pages/contact/sales-rep',
      fail: () => {
        wx.makePhoneCall({ phoneNumber: '13000000000' })
      }
    });
  },

  // 加入清单
  add_to_cart() {
    wx.showToast({
      title: "已加入租赁清单",
      icon: "success"
    });
  },

  // 获取电脑配置
  Load_Product(item_code) {
    const request_url = `${BASE_URL}/${this.data.product_type}/${this.data.product_code}/`;
    wx.request({
      url: request_url,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          const p = res.data;
          this.setData({
            product: p,
            img_list: [p.thumbnail_image],
          });
          //如果设备是台式电脑
          if (this.data.product_type == 'desktopcomputer') {
            this.setData({
              // 初始化选中项为默认配置的 item_code，好像不用初始化也不影响 js 逻辑，因为点击元素之后总是会赋值 item_code
              selections: {
                processor_code: p.processor.item_code,
                memory_code: p.memory.item_code,
                // 以下配件是非必需，可能没有数据
                system_disk_code: p.system_disk ? p.system_disk.item_code : null,
                data_disk_code: p.data_disk ? p.data_disk.item_code : null,
                graphics_card_code: p.graphics_card ? p.graphics_card.item_code : null,
                monitor_code: p.monitor ? p.monitor.item_code : null
              },
            });
          }
        }
      },
      fail: (err) => {
        console.error('获取电脑配置失败：', err);
        wx.showToast({
          title: '获取电脑配置失败',
          icon: 'none'
        });
      }
    });
  },

  // 监听组件传出的价格变动事件
  handlePriceUpdate: function (e) {
    this.setData({
      'product.rent_price': e.detail.newPrice // 更新页面显示的金额
    });
  }
})
