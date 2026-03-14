import { BASE_URL } from '../../config.js'; // 请确保路径正确

Page({
  data: {
    categoryList: [
      { category_id: "desktop-computer", category_title: "台式电脑" },
      { category_id: "laptop", category_title: "笔记本电脑" },
      { category_id: "all-in-one", category_title: "一体机" },
      { category_id: "printer", category_title: "打印机" },
      { category_id: "monitor", category_title: "显示器" }
    ],
    activeCategory: "desktop-computer",
    currentProducts: [],
    rawProducts: [], // 原始数据缓存
    priceOrder: 'asc',
    sortType: 'price'
  },

  onLoad: function (options) {
    this.fetchData(this.data.activeCategory);
  },

  switchCategory: function (e) {
    const id = e.currentTarget.dataset.id;
    if (this.data.activeCategory === id) return;

    this.setData({
      activeCategory: id,
      priceOrder: 'asc' 
    });
    this.fetchData(id);
  },

  fetchData: function (categoryId) {
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: `${BASE_URL}/${categoryId}/`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          // 附加产品类型，便于 WXML 进行分段判断
          const products = res.data.map(item => ({
            ...item,
            product_type: categoryId
          }));
          this.setData({ rawProducts: products }, () => {
            this.updateDisplayList();
          });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  toggleSort: function () {
    const newOrder = this.data.priceOrder === 'asc' ? 'desc' : 'asc';
    this.setData({
      priceOrder: newOrder
    }, () => {
      this.updateDisplayList();
    });
  },

  updateDisplayList: function () {
    const { rawProducts, priceOrder } = this.data;
    let products = [...rawProducts];
    
    products.sort((a, b) => {
      const priceA = parseFloat(a.rent_price || 0); // [cite: 1, 25]
      const priceB = parseFloat(b.rent_price || 0);
      return priceOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

    this.setData({
      currentProducts: products
    });
  }
})