const generate = require('@babel/generator').default
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const fs = require('fs')
const path = require('path')

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

// 列表/分页参数及方法名保护（不做重命名）
const RESERVED_LIST_PAGINATION = ['page', 'pageSize', 'limit', 'offset', 'list', 'total']
const RESERVED_PARAM_SET = new Set(RESERVED_LIST_PAGINATION)

// 生成不在关键字及保留名列表中的标识符 a, b, ..., z, aa, ab, ...
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
    if (!JS_KEYWORDS.has(name) && !RESERVED_PARAM_SET.has(name)) return name
    num++
  }
}

// 判断是否为业务相关列表/分页/数据集命名
function isListLikeName(name) {
  return /list|page|pageSize|total|count|records|data|items|result|fetch|query|load/i.test(name)
}

// 主函数：对单个文件的标识符重命名（分页/列表相关参数及函数/方法/属性名一律保留）
function renameIdentifiers(filePath) {
  const code = fs.readFileSync(filePath, 'utf8')
  // console.log(`重命名中: ${filePath}`)

  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['commonjs', 'classProperties']
  })
  const nameMap = new Map()
  let nameIndex = 0

  function nextName() {
    return generateSimpleName(nameIndex++)
  }

  // 第一遍：收集所有可重命名的绑定名（变量/参数/函数名/catch参数/import本地名等），列表/分页保留名一律不碰
  traverse(ast, {
    ImportDeclaration(path) {
      path.node.specifiers.forEach(specifier => {
        if (specifier.type === 'ImportDefaultSpecifier') {
          const original = specifier.local.name
          if (
            !nameMap.has(original) &&
            !RESERVED_PARAM_SET.has(original) &&
            !isListLikeName(original)
          )
            nameMap.set(original, nextName())
        } else if (specifier.type === 'ImportSpecifier') {
          const original = specifier.local.name
          if (
            !nameMap.has(original) &&
            !RESERVED_PARAM_SET.has(original) &&
            !isListLikeName(original)
          )
            nameMap.set(original, nextName())
        } else if (specifier.type === 'ImportNamespaceSpecifier') {
          const original = specifier.local.name
          if (
            !nameMap.has(original) &&
            !RESERVED_PARAM_SET.has(original) &&
            !isListLikeName(original)
          )
            nameMap.set(original, nextName())
        }
      })
    },
    VariableDeclarator(path) {
      if (path.node.id.type === 'Identifier') {
        const original = path.node.id.name
        if (
          !nameMap.has(original) &&
          !RESERVED_PARAM_SET.has(original) &&
          !isListLikeName(original)
        )
          nameMap.set(original, nextName())
      }
    },
    FunctionDeclaration(path) {
      if (path.node.id && path.node.id.type === 'Identifier') {
        const original = path.node.id.name
        // 列表/分页类函数名都跳过不重命名
        if (
          !nameMap.has(original) &&
          !RESERVED_PARAM_SET.has(original) &&
          !isListLikeName(original)
        )
          nameMap.set(original, nextName())
      }
      path.node.params.forEach(param => {
        if (param.type === 'Identifier') {
          const original = param.name
          if (
            !nameMap.has(original) &&
            !RESERVED_PARAM_SET.has(original) &&
            !isListLikeName(original)
          )
            nameMap.set(original, nextName())
        }
      })
    },
    FunctionExpression(path) {
      if (path.node.id && path.node.id.type === 'Identifier') {
        const original = path.node.id.name
        if (
          !nameMap.has(original) &&
          !RESERVED_PARAM_SET.has(original) &&
          !isListLikeName(original)
        )
          nameMap.set(original, nextName())
      }
      path.node.params.forEach(param => {
        if (param.type === 'Identifier') {
          const original = param.name
          if (
            !nameMap.has(original) &&
            !RESERVED_PARAM_SET.has(original) &&
            !isListLikeName(original)
          )
            nameMap.set(original, nextName())
        }
      })
    },
    ArrowFunctionExpression(path) {
      path.node.params.forEach(param => {
        if (param.type === 'Identifier') {
          const original = param.name
          if (
            !nameMap.has(original) &&
            !RESERVED_PARAM_SET.has(original) &&
            !isListLikeName(original)
          )
            nameMap.set(original, nextName())
        }
      })
    },
    ObjectMethod(path) {
      // 跳过所有关键列表/分页相关的方法名
      if (
        path.node.key &&
        path.node.key.type === 'Identifier' &&
        (RESERVED_PARAM_SET.has(path.node.key.name) || isListLikeName(path.node.key.name))
      ) {
        // 不做方法名收集
      } else if (path.node.key && path.node.key.type === 'Identifier') {
        const original = path.node.key.name
        if (!nameMap.has(original)) nameMap.set(original, nextName())
      }
      path.node.params.forEach(param => {
        if (param.type === 'Identifier') {
          const original = param.name
          if (
            !nameMap.has(original) &&
            !RESERVED_PARAM_SET.has(original) &&
            !isListLikeName(original)
          )
            nameMap.set(original, nextName())
        }
      })
    },
    ClassMethod(path) {
      if (
        path.node.key &&
        path.node.key.type === 'Identifier' &&
        (RESERVED_PARAM_SET.has(path.node.key.name) || isListLikeName(path.node.key.name))
      ) {
        // 不做方法名收集
      } else if (path.node.key && path.node.key.type === 'Identifier') {
        const original = path.node.key.name
        if (!nameMap.has(original)) nameMap.set(original, nextName())
      }
      path.node.params.forEach(param => {
        if (param.type === 'Identifier') {
          const original = param.name
          if (
            !nameMap.has(original) &&
            !RESERVED_PARAM_SET.has(original) &&
            !isListLikeName(original)
          )
            nameMap.set(original, nextName())
        }
      })
    },
    CatchClause(path) {
      if (path.node.param && path.node.param.type === 'Identifier') {
        const original = path.node.param.name
        if (
          !nameMap.has(original) &&
          !RESERVED_PARAM_SET.has(original) &&
          !isListLikeName(original)
        )
          nameMap.set(original, nextName())
      }
    }
  })

  // 第二遍：替换所有对应绑定引用（但不影响对象属性名/关键保留名等）
  traverse(ast, {
    Identifier(path) {
      const original = path.node.name
      // 跳过对象属性名、方法名、成员属性名、解构key、关键列表/分页参数名
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
        // 跳过所有列表/分页相关命名
        RESERVED_PARAM_SET.has(original) ||
        isListLikeName(original)

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
  // console.log(`重命名完成: ${filePath}，共 ${nameMap.size} 个标识符`)
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
