// index.js
Page({


  data: {
    banners: [],
    PCHosts: [],
    activeTab: 0, // 当前激活的标签页
    pc_products: [],
    allinone_products: [],
    laptop_products: [],
    printer_products: [],
    loading: false,
    error: null
  },


  onLoad() {
    this.loadBanners();
    this.loadAllProducts();
  },

  // 加载所有商品数据
  async loadAllProducts() {
    this.setData({ loading: true, error: null });
    
    try {
      // 并行请求所有数据，提高加载速度
      const [pcData, allinoneData, laptopData, printerData] = await Promise.all([
        getPCProducts(),
        getAllInOneProducts(),
        getLaptopProducts(),
        getPrinterProducts()
      ]);

      this.setData({
        pc_products: pcData,
        allinone_products: allinoneData,
        laptop_products: laptopData,
        printer_products: printerData,
        loading: false
      });
      
      console.log('所有商品数据加载成功');
    } catch (error) {
      console.error('加载商品数据失败:', error);
      this.setData({
        loading: false,
        error: '数据加载失败，请重试'
      });
      
      // 可以添加重试机制
      wx.showToast({
        title: '加载商品数据失败!',
        icon: 'none'
      });
    }
  },


  // 获取 banner 数据
  loadBanners() {
    wx.request({
      url: 'https://shenliu1818.cn/api/indexbanners/',
      method: 'GET',
      data: {
        limit: 3, // 限制获取数量
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            banners: res.data
          });
        }
      },
      fail: (err) => {
        console.error('获取 banners 失败：', err);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    });
  },


  // 切换标签页
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    });
  },
  
})

// 获取台式电脑数据
function getPCProducts() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://shenliu1818.cn/api/pc/',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('请求台式电脑数据失败，状态码：' + res.statusCode));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// 获取笔记本电脑数据
function getLaptopProducts() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://shenliu1818.cn/api/laptop/',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('请求笔记本电脑数据失败，状态码：' + res.statusCode));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// 获取一体机数据
function getAllInOneProducts() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://shenliu1818.cn/api/allinone/',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('请求一体机数据失败，状态码：' + res.statusCode));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// 获取打印机数据
function getPrinterProducts() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://shenliu1818.cn/api/printer/',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('请求打印机数据失败，状态码：' + res.statusCode));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
