import mysql from '../db/mysql'

const shopService = require('../service/shopService')

const verifyShop = async (req: any, res: any, next: any) => {
  const { shopName, province, city, area, address } = req.body
  try {
    const requiredFields = [
      { key: 'shopName', label: '店铺名称' }
      // { key: 'province', label: '省份' },
      // { key: 'city', label: '城市' },
      // { key: 'area', label: '区县' },
      // { key: 'address', label: '详细地址' }
    ]

    // 检查必填字段
    for (const field of requiredFields) {
      if (!req.body[field.key] || req.body[field.key].trim() === '') {
        console.error(`请填写${field.label}`)
        return res.status(400).json({
          code: 400,
          message: `请填写${field.label}`
        })
      }
    }

    // 检查店铺名称是否存在
    const result: any = await mysql.query(shopService.checkShopName, [shopName] as never[])
    // console.log(result, `111111`)
    if (result.length > 0) {
      const shop = result[0]
      const shopInfo = `${shop.shop_name}-(${shop.province}${shop.city}${shop.area}${shop.address})`
      const inputShopInfo = `${shopName}-(${province}${city}${area}${address})`
      // console.log(shopInfo, inputShopInfo, `222222`)
      if (shopInfo === inputShopInfo) {
        return res.status(400).json({
          code: 400,
          message: `店铺已存在`
        })
      }

      next()
    }

    next()
  } catch (error) {
    next(error)
  }
}

export default { verifyShop }
