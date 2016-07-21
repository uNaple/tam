module.exports = {
  api: {
    server_name: 'TM',
    http: {
      host: '0.0.0.0',
      port: 8000
    }
  },
  postgres : "postgres://tasker:password@127.0.0.1:5432/tm",
  redis: {
    host:"redis",
    port: 6379,
  }
}
