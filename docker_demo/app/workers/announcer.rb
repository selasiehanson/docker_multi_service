require 'sneakers'
require 'json'

class Announcer
  include Sneakers::Worker
  from_queue 'logs', env: nil

  def work(msg)
    puts msg
    raw = JSON.parse(msg)
    worker_trace "FOUND #{raw}"
    puts raw
    ack!
  end
end