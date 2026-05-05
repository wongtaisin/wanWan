import crypto from 'crypto'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import SysFile from '../models/file'
import { ReFail, ReSuccess, imgSuccess } from '../util/response'

const pathImg = 'uploads' // 上传文件夹

const UPLOAD_DIR = path.join(__dirname, `../../public/${pathImg}`)

// 配置文件存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR)
  },
  filename: (req, file, cb) => {
    // 生成文件名的哈希值
    const hash = crypto.createHash('md5').update(file.originalname).digest('hex')
    const ext = path.extname(file.originalname) // 文件扩展名
    cb(null, `${hash}${ext}`) // 使用哈希值作为文件名
  }
})

// 计算文件的哈希值
const calculateFileHash = (filePath: any) => {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.log('文件不存在:', filePath)
      return ''
    }

    const stats = fs.statSync(filePath)
    if (!stats.isFile()) {
      console.log('路径不是文件:', filePath)
      return ''
    }

    const fileBuffer = fs.readFileSync(filePath)
    return crypto.createHash('md5').update(fileBuffer).digest('hex')
  } catch (error: any) {
    console.log('计算文件哈希值失败:', error.message)
    return ''
  }
}

// 创建上传实例
const upload = multer({
  storage: storage,
  limits: { fileSize: Number(process.env.FILE_UPLOAD_SIZE) } // 限制文件大小
  // fileFilter: fileFilter
}).single('file')

class SysFileController {
  uploadFile = async (req: any, res: any) => {
    upload(req, res, async err => {
      try {
        if (err) {
          //避免太快，错误日志中间件没处理完
          setTimeout(function () {
            ReFail(res, `超过限制大小${Number(process.env.FILE_UPLOAD_SIZE) / 1024 / 1024}MB`, err)
          }, 500)
          return
        }

        if (!req.file) {
          return ReFail(res, '请上传图片')
        }

        const { module, remark } = req.body
        const filePath = req.file.path // 上传的文件路径
        const fileHash = calculateFileHash(filePath) // 计算文件哈希值
        const ext = path.extname(req.file.originalname) // 文件扩展名
        const newFileName = `${fileHash}${ext}` // 新文件名
        const newFilePath = path.join(UPLOAD_DIR, newFileName) // 新文件路径
        const suffix = req.file.originalname.split('.').pop() // 后缀
        // const fullUrl = req.protocol + '://' + req.get('host') // 取完整的URL，包括协议、域名和端口
        const serverUrl = '/' + pathImg + '/' + newFileName // 服务器上的文件URL

        const image: any = await SysFile.create({
          url: serverUrl,
          suffix,
          module,
          remark
        })

        // 检查图片是否已存在
        if (fs.existsSync(newFilePath)) {
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath) // 删除临时文件
          }

          const img: any = await SysFile.findOne({ where: { url: serverUrl } })
          if (img) {
            imgSuccess(res, req.query.source, img)
          }
        } else {
          // 重命名文件
          fs.renameSync(filePath, newFilePath)
          imgSuccess(res, req.query.source, image)
        }
      } catch (error) {
        ReFail(res, '上传文件失败', error)
      }
    })
  }

  //删除文件
  deleteFile = async (req: { params: { id: any } }, res: any) => {
    const { id } = req.params
    const image: any = await SysFile.findByPk(id)
    if (!image) {
      ReFail(res, '文件不存在')
      return
    }
    try {
      const count = await SysFile.count({ where: { url: image.url } })
      if (count == 1) {
        const url = image.url
        const filePath = path.join(__dirname, '../../public/', url)
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          console.log('删除文件', filePath)
          fs.unlinkSync(filePath)
        }
      }
      await image.destroy()
      ReSuccess(res, 0, '删除文件成功')
    } catch (error) {
      ReFail(res, '删除文件失败', error)
    }
  }

  getImages = async (req: { query: { module: any; entityId: any } }, res: any) => {
    const { module, entityId } = req.query
    const images: any = await SysFile.findAll({ where: { module, entityId } })
    ReSuccess(res, images)
  }
}

export default new SysFileController()
