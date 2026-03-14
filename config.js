// config.js

// 1. 定义当前运行环境（本地开发填 'dev'，准备上线改填 'prod'）
const env = 'dev'; 

// 2. 配置不同环境下的基础 URL
const base_urls = {
  // 开发环境 (局域网 IP 或本地 mock 地址)
  dev: 'http://192.168.31.190/api', 
  
  // 生产环境 (正式上线的 HTTPS 域名)
  prod: 'https://shenliu1818.cn/api' 
};

// 3. 根据当前环境导出对应的基础 URL
export const BASE_URL = base_urls[env];

// 你还可以把其他全局配置也写在这里，比如：
// export const TIMEOUT = 5000;