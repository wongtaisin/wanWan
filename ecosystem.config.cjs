module.exports = {
  apps: [
    // ============================
    // 开发环境（使用 ts-node/register 运行 TS）
    // ============================
    {
      name: 'wanWan-dev',
      script: 'node',
      args: '-r ts-node/register app.ts', // 使用 ts-node 运行 TS
      watch: [
        'controllers',
        'db',
        'docs',
        'json',
        'middleware',
        'models',
        'public',
        'routes',
        'service',
        'util',
        'app.ts'
      ],
      ignore_watch: ['node_modules', 'logs', 'dist'],
      watch_delay: 500,
      autorestart: true,
      env: {
        NODE_ENV: 'development'
      }
    },

    // ============================
    // 生产环境（使用编译后 JS）
    // dist/app.js 必须存在（tsc 编译后）
    // ============================
    {
      name: 'wanWan-prod',
      script: 'dist/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
