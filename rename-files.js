/**
 * 说明：原脚本只重命名了 dist 下的 .js 文件，但 require/import 的路径没有一起同步替换，导致运行时 require 失败。
 * 本脚本需先生成所有 .js 新旧路径的映射，再修改所有 require/import 路径，最后再实际进行重命名。
 */

const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default

/** ---------- 工具方法 ---------- **/

// a, b, c..., aa, ab...
function generateSimpleName(index) {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  let name = ''
  const base = chars.length
  do {
    name = chars[index % base] + name
    index = Math.floor(index / base) - 1
  } while (index >= 0)
  // 增加3位随机数
  const rand = Math.floor(Math.random() * 1000)
  const randStr = rand.toString().padStart(3, '0')
  return name + randStr
}

// 递归收集 .js 文件
function collectJSFiles(directory, list = []) {
  const files = fs.readdirSync(directory)
  files.forEach(file => {
    const full = path.join(directory, file)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      collectJSFiles(full, list)
    } else if (file.endsWith('.js')) {
      list.push(full)
    }
  })
  return list
}

/** ---------- 修改 require/import 路径 ---------- **/

function updateImportPaths(filePath, absRenameMap) {
  const code = fs.readFileSync(filePath, 'utf8')
  const fileDir = path.dirname(filePath)

  const ast = parser.parse(code, {
    sourceType: 'unambiguous',
    plugins: ['dynamicImport']
  })

  function fixLiteral(node) {
    if (!node || !node.value) return

    const rawPath = node.value
    if (!rawPath.startsWith('.')) return

    const absOld = path.resolve(fileDir, rawPath + (path.extname(rawPath) ? '' : '.js'))
    if (!absRenameMap.has(absOld)) return

    const absNew = absRenameMap.get(absOld)

    let newRel = path.relative(fileDir, absNew)
    if (!newRel.startsWith('.')) newRel = './' + newRel
    newRel = newRel.replace(/\\/g, '/').replace(/\.js$/, '')

    node.value = newRel
  }

  traverse(ast, {
    CallExpression(p) {
      const callee = p.node.callee
      if (callee.type === 'Identifier' && callee.name === 'require') {
        const arg = p.node.arguments[0]
        if (arg && arg.type === 'StringLiteral') fixLiteral(arg)
      }
    },
    ImportDeclaration(p) {
      const src = p.node.source
      if (src && src.type === 'StringLiteral') fixLiteral(src)
    },
    Import(p) {
      const arg = p.parent.arguments?.[0]
      if (arg && arg.type === 'StringLiteral') fixLiteral(arg)
    }
  })

  const output = generate(ast)
  fs.writeFileSync(filePath, output.code, 'utf8')
}

/** ---------- 重命名主流程 ---------- **/

function renameFilesAndFixImports() {
  const dist = path.resolve('./dist')
  const jsFiles = collectJSFiles(dist)

  // 1. 生成新旧路径映射
  const absRenameMap = new Map()
  const dirCount = {}

  jsFiles.forEach(oldPath => {
    const dir = path.dirname(oldPath)
    const base = path.basename(oldPath)

    if (base === 'app.js') {
      absRenameMap.set(oldPath, oldPath)
      return
    }

    if (!dirCount[dir]) dirCount[dir] = 0
    const newName = generateSimpleName(dirCount[dir]++) + '.js'
    const newAbs = path.join(dir, newName)

    absRenameMap.set(oldPath, newAbs)
  })

  // 2. 修改所有 require/import 路径
  console.log('开始修正 require/import 路径...')
  jsFiles.forEach(file => updateImportPaths(file, absRenameMap))

  // 3. 重命名
  const tmpExt = '.tmp-rn'
  const moves = []

  // 先改成带 .tmp-rn 后缀，避免重名覆盖
  absRenameMap.forEach((newAbs, oldAbs) => {
    if (oldAbs !== newAbs) {
      const tmpAbs = newAbs + tmpExt
      fs.renameSync(oldAbs, tmpAbs)
      moves.push({ tmpAbs, newAbs })
    }
  })

  // 再去掉 .tmp-rn，完成最终重命名
  moves.forEach(({ tmpAbs, newAbs }) => fs.renameSync(tmpAbs, newAbs))

  console.log('重命名完成，并同步修正 import/require 路径！')
}

renameFilesAndFixImports()
