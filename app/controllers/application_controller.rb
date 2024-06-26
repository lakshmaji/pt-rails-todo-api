# frozen_string_literal: true

# Todo API
class ApplicationController < ActionController::API
  rescue_from StandardError, with: :handle_standard_error

  private

  def handle_standard_error(exception)
    Rails.logger.error(exception.message)
    render json: { error: 'An error occurred', message: 'Something went wrong at our end' },
           status: :internal_server_error
  end
end
