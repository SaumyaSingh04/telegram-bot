module.exports = {
  apps: [
    {
      name: 'telegram-ai-bot',
      script: 'src/server.js',
      instances: 1, // single instance — bot polling must not run in cluster mode
      exec_mode: 'fork',
      env: { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production' },
      watch: false,
      max_memory_restart: '512M',
      restart_delay: 3000,
      max_restarts: 10,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      merge_logs: true,
    },
  ],
};
