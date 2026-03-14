import { BASE_URL } from '../../config.js';
Component({
  properties: {
    // 基础产品数据
    product: Object,
  },
  data: {
    upgrade_options: {},
    selections: {},
    loading: false
  },
  // 监听数据变化，初始化选中项及请求可选配置数据
  observers: {
    'product': function (p) {
      if (p && p.item_code && !this.data.selections.processor_code) {
        this.setData({
          selections: {
            processor_code: p.processor?.item_code,
            memory_code: p.memory?.item_code,
            system_disk_code: p.system_disk?.item_code || null,
            data_disk_code: p.data_disk?.item_code || null,
            graphics_card_code: p.graphics_card?.item_code || null,
            monitor_code: p.monitor?.item_code || null
          }
        });
        // 加载可选配置的数据
        this.loadComponentData(p.item_code);
      }
    }
  },
  methods: {
    // 加载可选配置的数据
    loadComponentData(product_item_code) {
      const request_url = `${BASE_URL}/optional-upgrade/${product_item_code}/`;
      wx.request({
        url: request_url,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200) {
            this.setData({
              upgrade_options: res.data
            });
          }
        },
        fail: (err) => {
          console.error('获取可选配置失败：', err);
          wx.showToast({
            title: '获取可选配置失败',
            icon: 'none'
          });
        }
      });
    },

    // 获取更新的价格
    updatePrice() {
      const selections = this.data.selections;
      // 构建请求数据：处理字段映射
      const requestData = {
        processor_code: selections.processor_code,
        memory_code: selections.memory_code,
        system_disk_code: selections.system_disk_code,
        data_disk_code: selections.data_disk_code,
        graphics_card_code: selections.graphics_card_code,
        monitor_code: selections.monitor_code
      };

      const request_url = `${BASE_URL}/custom-desktop-config/`;
      wx.request({
        url: request_url,
        method: 'POST',
        data: requestData,
        success: (res) => {
          if (res.statusCode === 200) {
            // 重要：计算出新价格后，通知父页面更新底栏的价格显示
            this.triggerEvent('priceChange', {
              newPrice: res.data.rent_price
            })
            this.setData({
              loading: false,
            });
          }
        },
        fail: (err) => {
          console.error('获取更新价格失败：', err);
          wx.showToast({
            title: '获取更新价格失败',
            icon: 'none'
          });
          this.setData({
            loading: false,
          });
        }
      });
    },

    selectSpec(e) {
      if (this.data.loading) return;
      const { partType, itemCode } = e.currentTarget.dataset;
      const part_code = `${partType}_code`;
      const currentCode = this.data.selections[part_code];
      if (currentCode === itemCode) return;

      this.setData({
        [`selections.${part_code}`]: itemCode,
        loading: true
      });

      this.updatePrice();
    },
  }
})