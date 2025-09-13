// 平台类型定义
export type Platform =
  | 'h5'
  | 'mp-weixin'
  | 'mp-alipay'
  | 'mp-baidu'
  | 'mp-toutiao'
  | 'mp-qq'
  | 'app-plus'
  | 'quickapp-webview'

// 动态检测当前平台
export function getPlatform(): Platform {
  // #ifdef H5
  return 'h5'
  // #endif

  // #ifdef MP-WEIXIN
  return 'mp-weixin'
  // #endif

  // #ifdef MP-ALIPAY
  return 'mp-alipay'
  // #endif

  // #ifdef MP-BAIDU
  return 'mp-baidu'
  // #endif

  // #ifdef MP-TOUTIAO
  return 'mp-toutiao'
  // #endif

  // #ifdef MP-QQ
  return 'mp-qq'
  // #endif

  // #ifdef APP-PLUS
  return 'app-plus'
  // #endif

  // #ifdef QUICKAPP-WEBVIEW
  return 'quickapp-webview'
  // #endif

  // 默认返回 h5
  return 'h5'
}

// 获取平台显示名称
export function getPlatformName(platform: Platform): string {
  const platformNames: Record<Platform, string> = {
    h5: 'H5网页',
    'mp-weixin': '微信小程序',
    'mp-alipay': '支付宝小程序',
    'mp-baidu': '百度小程序',
    'mp-toutiao': '字节跳动小程序',
    'mp-qq': 'QQ小程序',
    'app-plus': 'App应用',
    'quickapp-webview': '快应用'
  }
  return platformNames[platform] || '未知平台'
}

// 检查是否为小程序平台
export function isMiniProgram(): boolean {
  const platform = getPlatform()
  return platform.startsWith('mp-')
}

// 检查是否为App平台
export function isApp(): boolean {
  const platform = getPlatform()
  return platform === 'app-plus'
}

// 检查是否为H5平台
export function isH5(): boolean {
  const platform = getPlatform()
  return platform === 'h5'
}

// 获取当前平台信息
export function getPlatformInfo() {
  const platform = getPlatform()
  return {
    platform,
    name: getPlatformName(platform),
    isMiniProgram: isMiniProgram(),
    isApp: isApp(),
    isH5: isH5()
  }
}
