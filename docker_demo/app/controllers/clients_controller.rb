class ClientsController < ApplicationController
  
  def index
    render json: Client.all
  end

  def create
    client = Client.new(client_params)
    Publisher.publish("clients", client_params)
    if client.save 
      render json: {success: true, client: client}
    else
      render json: {success: false, client: nil}
    end
  end

  def client_params
    params.require(:client).permit(:name, :phone, :email)
  end
end
