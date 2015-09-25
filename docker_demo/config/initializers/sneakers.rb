host = ENV['RMQ_PORT_5672_TCP_ADDR'] 
port = ENV['RMQ_PORT_5672_TCP_PORT'] 
user = 'guest'
pass = 'guest'
Sneakers.configure({
  amqp: "amqp://#{user}:#{pass}@#{host}:#{port}",
  exchange: 'logs',
  exchange_type: :fanout
  })
Sneakers.logger.level = Logger::INFO # the default DEBUG is too noisy
