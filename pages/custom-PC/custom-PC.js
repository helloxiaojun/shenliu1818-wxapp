Page({
  data: {
    // 组件数据
    CPU_list: [],
    primary_disk_list: [],
    data_disk_list: [],
    monitor_list: [],
    GPU_list: [],
    compatible_memory_list: [],

    // 用户选择
    selectedCpu: null,
    selectedMemory: null,
    selected_primary_dsik: null,
    selected_data_dsik: null,
    selectedGpu: null,
    selectedMonitor: null,

    // 不需要选项
    no_primary_disk: false,
    no_data_disk: false,
    gpuNotNeeded: false,
    monitorNotNeeded: false,

    // 状态标志
    loading: false,
    rental_result: null,
    canGetQuote: false
  },

  onLoad() {
    this.loadComponents();
  },

  // 加载配件数据
  loadComponents() {
    wx.request({
      url: 'https://shenliu1818.cn/api/all-components/',
      method: 'GET',
      data: {
        // 请求体的参数
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            CPU_list: res.data.CPU,
            primary_disk_list: res.data.primary_disk,
            data_disk_list: res.data.data_disk,
            monitor_list: res.data.monitor,
            GPU_list: res.data.GPU,
          })
        }
      },
      fail: (err) => {
        console.error('获取配件数据失败：', err);
        wx.showToast({
          title: '获取配件数据失败！',
          icon: 'none'
        });
      }
    })
  },

  // 选择CPU后加载兼容的内存
  loadCompatibleMemory(memory_generation) {
    wx.request({
      url: 'https://shenliu1818.cn/api/compatible-memory/',
      method: 'POST',
      data: {
        // 请求体的参数
        memory_generation: memory_generation
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            compatible_memory_list: res.data
          })
        }
      },
      fail: (err) => {
        console.error('获取 cpu 适配的内存配件数据失败：', err);
        wx.showToast({
          title: '获取 cpu 适配的内存配件数据失败',
          icon: 'none'
        });
      }
    })
  },

  // 选择CPU
  selectCpu(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      selectedCpu: item,
      selectedMemory: null, // 重置内存选择
      rental_result: null
    });

    // 加载兼容的内存
    this.loadCompatibleMemory(item.compatible_memory);
  },

  // 选择内存
  selectMemory(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      selectedMemory: item,
      canGetQuote: true,
      rental_result: null
    });
  },

  // 选择主硬盘
  selectPrimaryDisk(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      selected_primary_dsik: item,
      no_primary_disk: false,
      rental_result: null
    });
  },
  // 选择数据硬盘
  selectDataDisk(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      selected_data_dsik: item,
      no_data_disk: false,
      rental_result: null
    });
  },

  // 选择显卡
  selectGpu(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      selectedGpu: item,
      gpuNotNeeded: false,
      rental_result: null
    });
  },

  // 选择显示器
  selectMonitor(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      selectedMonitor: item,
      monitorNotNeeded: false,
      rental_result: null
    });
  },

  // 选择不需要主硬盘
  selectNoPrimaryDisk() {
    this.setData({
      selected_primary_dsik: null,
      no_primary_disk: true,
      rental_result: null
    });
  },

  // 选择不需要数据硬盘
  selectNoDataDisk() {
    this.setData({
      selected_data_dsik: null,
      no_data_disk: true,
      rental_result: null
    });
  },

  // 选择不需要显卡
  selectNoGpu() {
    this.setData({
      selectedGpu: null,
      gpuNotNeeded: true,
      rental_result: null
    });
  },

  // 选择不需要显示器
  selectNoMonitor() {
    this.setData({
      selectedMonitor: null,
      monitorNotNeeded: true,
      rental_result: null
    });
  },

  // 重新选择CPU
  reselectCpu() {
    this.setData({
      selectedCpu: null,
      selectedMemory: null,
      canGetQuote: false,
      rental_result: null
    });
  },

  // 重新选择内存
  reselectMemory() {
    this.setData({
      selectedMemory: null,
      canGetQuote: false,
      rental_result: null
    });
  },

  // 重新选择硬盘
  reselectPrimaryDisk() {
    this.setData({
      selected_primary_dsik: null,
      no_primary_disk: false,
      rental_result: null
    });
  },

  // 重新选择数据硬盘
  reselectDataDisk() {
    this.setData({
      selected_data_dsik: null,
      no_data_disk: false,
      rental_result: null
    });
  },

  // 重新选择显卡
  reselectGpu() {
    this.setData({
      selectedGpu: null,
      gpuNotNeeded: false,
      rental_result: null
    });
  },

  // 重新选择显示器
  reselectMonitor() {
    this.setData({
      selectedMonitor: null,
      monitorNotNeeded: false,
      rental_result: null
    });
  },

  // 获取报价
  getQuote() {
    if (!this.data.selectedCpu || !this.data.selectedMemory) return;

    this.setData({ loading: true });

    // 构建请求数据
    const requestData = {
      CPU_id: this.data.selectedCpu.id,
      memory_id: this.data.selectedMemory.id,
      primary_disk_id: this.data.no_primary_disk ? null : (this.data.selected_primary_dsik ? this.data.selected_primary_dsik.id : null),
      data_disk_id: this.data.no_data_disk ? null : (this.data.selected_data_dsik ? this.data.selected_data_dsik.id : null),
      GPU_id: this.data.gpuNotNeeded ? null : (this.data.selectedGpu ? this.data.selectedGpu.id : null),
      monitor_id: this.data.monitorNotNeeded ? null : (this.data.selectedMonitor ? this.data.selectedMonitor.id : null)
    };

    wx.request({
      url: 'https://shenliu1818.cn/api/computer-config/',
      method: 'POST',
      data: {
        CPU_id: requestData.CPU_id,
        memory_id: requestData.memory_id,
        primary_disk_id: requestData.primary_disk_id,
        data_disk_id: requestData.data_disk_id,
        GPU_id: requestData.GPU_id,
        monitor_id: requestData.monitor_id
      },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log('API响应:', res.data)
          this.setData({
            loading: false,
            computer_config: res.data.config_data,
            rental_price: res.data.rental_price,
            rental_result: true,
          })
          wx.pageScrollTo({
            selector: "#section-CPU",
            duration: 500,
          })
        }
      },
      fail: (err) => {
        console.error('获取租金报价失败：', err);
        wx.showToast({
          title: '获取租金报价失败！',
          icon: 'none'
        })
      }
    })
  },

});