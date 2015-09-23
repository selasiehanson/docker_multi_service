require 'sneakers'

class Announcer
  include Sneakers::Worker
  from_queue 'announcements'


  def work(msg)
    raw = Json.parse(msg)
    worker_trace "FOUND #{raw}"
    ack!
  end
end