# frozen_string_literal: true

# RegsitartionsController
class AuthController < ApplicationController
  before_action :doorkeeper_authorize!, only: [:current_user]

  def signup
    client_app = Doorkeeper::Application.find_by(uid: client_params[:client_id])

    unless client_app
      return render json: { error: I18n.t('doorkeeper.errors.messages.invalid_client') },
                    status: :unauthorized
    end

    @user = User.new(user_params)
    if @user.save
      @results = model_results(@user, client_app)
      render json: @results, status: :created
    else
      render json: { error: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def current_user
    @user = User.find(doorkeeper_token.resource_owner_id)

    if @user
      render json: @user
    else
      render(json: { error_message: 'User not authorized' }, status: :unauthorized)
    end
  end

  private

  def model_results(user, client_app, _token_type = 'Bearer')
    access_token = Doorkeeper::AccessToken.find_or_create_for(
      resource_owner: user.id,
      application: client_app,
      refresh_token: generate_refresh_token,
      expires_in: Doorkeeper.configuration.access_token_expires_in.to_i,
      scopes: ''
    )

    { user:, tokens: { refresh_token: access_token.refresh_token, access_token: access_token.token } }
  end

  def generate_refresh_token
    loop do
      token = SecureRandom.hex(32)

      break token unless Doorkeeper::AccessToken.exists?(refresh_token: token)
    end
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :first_name, :last_name)
  end

  def client_params
    params.permit(:client_id)
  end
end
