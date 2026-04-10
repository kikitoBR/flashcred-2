module.exports = {
  apps: [
    {
      name: 'flashcred-server',
      script: 'dist/src/index.js',
      cwd: '/var/www/flashcred/server',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
        RPA_HEADLESS: 'false',
        DISPLAY: ':99'
      },
      max_memory_restart: '1200M',
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 3000
    }
  ]
};
