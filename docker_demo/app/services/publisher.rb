class Publisher

  def self.publish(exchange, message = {})
    ex = channel.fanout("docker_demo.#{exchange}")
    ex.publish(message.to_json)
  end

  def self.channel
    @channel ||= connection.create_channel
  end


  def self.connection
    host = ENV['RMQ_PORT_5672_TCP_ADDR'] 
    port = ENV['RMQ_PORT_5672_TCP_PORT'] 
    user = 'guest'
    pass = 'guest'
    @connection ||= Bunny.new(
      host: host, 
      port: port,
      user: user,
      pass: pass).tap do |c|
      c.start
    end
  end
end
