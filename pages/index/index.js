import { BASE_URL } from '../../config.js';

Page({
  data: {
    banners: [],
    categoryList: [], 
    loading: false,
    error: null
  },

  onLoad() {
    // 页面加载时统一触发聚合加载
    this.initPageData();
  },

  /**
   * 优化后的初始化函数
   * 使用 Promise.all 并行加载 Banner 和 商品分类
   */
  async initPageData() {
    this.setData({ loading: true, error: null });
    
    try {
      // 核心优化：并行发送请求，总耗时取决于最慢的一个接口
      const [banners, categories] = await Promise.all([
        getBanners(),
        getRecommendationCategories()
      ]);

      const categoryWithProducts = await Promise.all(
        categories.map(async (cat) => {
          try {
            const products = await getCategoryDetails(cat.id);
            return {
              category_id: cat.id,
              category_title: cat.title,
              promotional_description: cat.promotional_description,
              category_banner_image: cat.category_banner_image,
              products: products
            };
          } catch (e) {
            console.error(`加载分类 ${cat.id} 失败`, e);
            return null;
          }
        })
      );

      this.setData({
        banners: banners,
        categoryList: categoryWithProducts.filter(item => item !== null),
        loading: false
      });
    } catch (error) {
      console.error('初始化数据失败:', error);
      this.setData({
        loading: false,
        error: '系统繁忙，请稍后重试'
      });
    }
  }
});

/* 封装 Banner 请求 */
function getBanners() {
  return new Promise((resolve, reject) => {
    const request_url = `${BASE_URL}/mainpage-banners/`;
    wx.request({
      url: request_url,
      method: 'GET',
      data: { limit: 3 },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('Mainpage Banner 请求失败'));
        }
      },
      fail: (err) => reject(err)
    });
  });
}

/* 获取推荐分类列表 */
function getRecommendationCategories() {
  return new Promise((resolve, reject) => {
    const request_url = `${BASE_URL}/recommendation-categories/`;
    wx.request({
      url: request_url,
      method: 'GET',
      success: (res) => res.statusCode === 200 ? resolve(res.data) : reject(res),
      fail: (err) => reject(err)
    });
  });
}

/* 获取特定分类下的产品详情 */
function getCategoryDetails(id) {
  return new Promise((resolve, reject) => {
    const request_url = `${BASE_URL}/recommendation-categories/${id}/`;
    wx.request({
      url: request_url,
      method: 'GET',
      success: (res) => res.statusCode === 200 ? resolve(res.data) : reject(res),
      fail: (err) => reject(err)
    });
  });
}