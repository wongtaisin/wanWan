const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default

// JavaScript 关键字集合（防止用作标识符）
const JS_KEYWORDS = new Set([
  'abstract',
  'arguments',
  'await',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'double',
  'else',
  'enum',
  'eval',
  'export',
  'extends',
  'false',
  'final',
  'finally',
  'float',
  'for',
  'function',
  'goto',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'int',
  'interface',
  'let',
  'long',
  'native',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'volatile',
  'while',
  'with',
  'yield'
])

// 针对分页和列表参数不做重命名
const PAGINATION_PARAMS = ['page', 'pageSize', 'limit', 'offset']

// 生成不在关键字列表中的字母序标识符 a, b, ..., z, aa, ab, ...
function generateSimpleName(index) {
  let name = ''
  let num = index
  while (true) {
    let temp = num
    name = ''
    while (temp >= 0) {
      name = String.fromCharCode(97 + (temp % 26)) + name
      temp = Math.floor(temp / 26) - 1
    }
    // 生成参数名时只排除 JS 关键字和分页参数（不再区分白名单方法名）
    if (!JS_KEYWORDS.has(name) && !PAGINATION_PARAMS.includes(name)) return name
    num++
  }
}

// 判断函数（含方法）是否为列表/分页业务相关（返回 true 表示 paginate/list type）
function isListLikeFunction(funcNode) {
  // 方法名、函数名包含 list、page、pagesize、total、fetch、query、load 等关键词，视为列表相关
  if (
    funcNode.id &&
    funcNode.id.type === 'Identifier' &&
    /list|page|total|fetch|query|load/i.test(funcNode.id.name)
  ) {
    return true
  }
  // 对于 ObjectMethod 或 ClassMethod
  if (
    funcNode.key &&
    funcNode.key.type === 'Identifier' &&
    /list|page|total|fetch|query|load/i.test(funcNode.key.name)
  ) {
    return true
  }
  return false
}

// 主函数：对单个文件的标识符重命名（分页参数保留）
function renameIdentifiers(filePath) {
  const code = fs.readFileSync(filePath, 'utf8')
  console.log(`重命名中: ${filePath}`)

  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['commonjs', 'classProperties']
  })
  const nameMap = new Map()
  let nameIndex = 0

  function nextName() {
    return generateSimpleName(nameIndex++)
  }

  // 第一遍：收集所有可重命名的绑定名（变量/参数/函数名/catch参数等），分页/列表参数 & 列表相关函数单独处理
  traverse(ast, {
    VariableDeclarator(path) {
      if (path.node.id.type === 'Identifier') {
        const original = path.node.id.name
        if (!nameMap.has(original) && !PAGINATION_PARAMS.includes(original))
          nameMap.set(original, nextName())
      }
    },
    FunctionDeclaration(path) {
      // 若为列表/分页相关函数名，依然允许重命名（仅分页参数保留）；否则正常规则
      let skipFuncName = false
      if (path.node.id && path.node.id.type === 'Identifier') {
        const original = path.node.id.name
        skipFuncName = PAGINATION_PARAMS.includes(original)
        if (!nameMap.has(original) && !skipFuncName) nameMap.set(original, nextName())
      }
      path.node.params.forEach(param => {
        if (param.type === 'Identifier') {
          const original = param.name
          // 保留分页相关参数原名
          if (!nameMap.has(original) && !PAGINATION_PARAMS.includes(original)) {
            nameMap.set(original, nextName())
          }
        }
      })
    },
    FunctionExpression(path) {
      // 变量名是否为分页参数
      let skipFuncName = false
      if (path.node.id && path.node.id.type === 'Identifier') {
        const original = path.node.id.name
        skipFuncName = PAGINATION_PARAMS.includes(original)
        if (!nameMap.has(original) && !skipFuncName) nameMap.set(original, nextName())
      }
      path.node.params.forEach(param => {
        if (param.type === 'Identifier') {
          const original = param.name
          if (!nameMap.has(original) && !PAGINATION_PARAMS.includes(original)) {
            nameMap.set(original, nextName())
          }
        }
      })
    },
    ArrowFunctionExpression(path) {
      path.node.params.forEach(param => {
        if (param.type === 'Identifier') {
          const original = param.name
          if (!nameMap.has(original) && !PAGINATION_PARAMS.includes(original)) {
            nameMap.set(original, nextName())
          }
        }
      })
    },
    ObjectMethod(path) {
      // 方法名为分页参数不重命名
      let skipMethodName =
        path.node.key &&
        path.node.key.type === 'Identifier' &&
        PAGINATION_PARAMS.includes(path.node.key.name)
      if (!skipMethodName && path.node.key && path.node.key.type === 'Identifier') {
        const original = path.node.key.name
        if (!nameMap.has(original)) nameMap.set(original, nextName())
      }
      path.node.params.forEach(param => {
        if (param.type === 'Identifier') {
          const original = param.name
          if (!nameMap.has(original) && !PAGINATION_PARAMS.includes(original)) {
            nameMap.set(original, nextName())
          }
        }
      })
    },
    ClassMethod(path) {
      let skipMethodName =
        path.node.key &&
        path.node.key.type === 'Identifier' &&
        PAGINATION_PARAMS.includes(path.node.key.name)
      if (!skipMethodName && path.node.key && path.node.key.type === 'Identifier') {
        const original = path.node.key.name
        if (!nameMap.has(original)) nameMap.set(original, nextName())
      }
      path.node.params.forEach(param => {
        if (param.type === 'Identifier') {
          const original = param.name
          if (!nameMap.has(original) && !PAGINATION_PARAMS.includes(original)) {
            nameMap.set(original, nextName())
          }
        }
      })
    },
    CatchClause(path) {
      if (path.node.param && path.node.param.type === 'Identifier') {
        const original = path.node.param.name
        if (!nameMap.has(original) && !PAGINATION_PARAMS.includes(original)) {
          nameMap.set(original, nextName())
        }
      }
    }
  })

  // 第二遍：替换所有对应绑定引用（但不影响对象属性名/分页参数等）
  traverse(ast, {
    Identifier(path) {
      const original = path.node.name
      // 判断是否跳过重命名
      const skipProps =
        // 跳过对象字面量属性名 key
        (path.parent.type === 'ObjectProperty' &&
          path.parent.key === path.node &&
          !path.parent.computed) ||
        // 跳过对象方法/类方法名
        ((path.parent.type === 'ClassMethod' || path.parent.type === 'ObjectMethod') &&
          path.parent.key === path.node &&
          !path.parent.computed) ||
        // 跳过成员表达式属性名 obj.key
        (path.parent.type === 'MemberExpression' &&
          path.parent.property === path.node &&
          !path.parent.computed) ||
        // 跳过解构 property 的 key
        ((path.parent.type === 'ObjectPattern' || path.parent.type === 'ObjectProperty') &&
          path.parent.key === path.node &&
          !path.parent.computed) ||
        // 跳过分页参数
        PAGINATION_PARAMS.includes(original)

      const skip = [
        'true',
        'false',
        'null',
        'undefined',
        'this',
        'super',
        'arguments',
        'require',
        'module',
        'exports',
        '__dirname',
        '__filename'
      ]
      if (skip.includes(original) || skipProps) return

      if (nameMap.has(original)) path.node.name = nameMap.get(original)
    }
  })

  // 生成和保存代码
  const output = generate(ast, {}, code)
  fs.writeFileSync(filePath, output.code)
  console.log(`重命名完成: ${filePath}，共 ${nameMap.size} 个标识符`)
}

// 递归重命名目录下所有 js 文件
function renameDirectory(directory) {
  fs.readdirSync(directory).forEach(file => {
    const filePath = path.join(directory, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      renameDirectory(filePath)
    } else if (path.extname(file) === '.js') {
      renameIdentifiers(filePath)
    }
  })
}

console.log('开始重命名 dist 目录标识符...')
renameDirectory('./dist')
console.log('所有文件重命名完成！')
