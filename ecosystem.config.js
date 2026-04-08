export default {
  apps: [
    {
      name: 'hsfasaude-site',
      script: '/home/hsfasaude/htdocs/hsfasaude.com.br/server.js',
      cwd: '/home/hsfasaude/htdocs/hsfasaude.com.br',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/home/hsfasaude/htdocs/hsfasaude.com.br/logs/pm2-error.log',
      out_file: '/home/hsfasaude/htdocs/hsfasaude.com.br/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '5s',
      kill_timeout: 5000,
      listen_timeout: 10000,
      max_memory_restart: '500M',
      node_args: '--max-old-space-size=512',
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'dist', 'public_html', 'data']
    }
  ]
};

