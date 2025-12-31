import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/database'
// const Shop = require('./shop') // 引入店铺模型

class File extends Model {}

File.init(
  {
    url: {
      type: DataTypes.STRING, // 文件URL
      allowNull: false // URL不能为空
    },
    suffix: {
      type: DataTypes.STRING, // 文件后缀类型（图片或文件）
      allowNull: true // 后缀可以为空
    },
    module: {
      type: DataTypes.ENUM('expenses', 'shop'), // 文件所属模块（花销或店铺）
      allowNull: true // 模块可以为空
    },
    remark: {
      type: DataTypes.STRING, // 文件备注
      allowNull: true // 备注可以为空
    }
    // entityId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   comment: '关联实体ID（如用户ID、商品ID）'
    // }
  },
  {
    sequelize, // 数据库实例
    modelName: 'File', // 模型名称
    tableName: 'file', // 数据库表名
    timestamps: true, // 启用时间戳字段（createdAt, updatedAt）
    // 👇 关键：映射自定义时间字段
    createdAt: 'created_date',
    updatedAt: 'update_date'
    // 如果还有 deletedAt（软删除），也可以配：
    // deletedAt: 'deleted_date',
    // paranoid: true // 启用软删除
  }
)

// 定义关联关系
// Shop.hasMany(File, { foreignKey: 'entityId', as: 'images', scope: { module: 'shop' } })
// File.belongsTo(Shop, { foreignKey: 'entityId', as: 'shop' })

export default File
