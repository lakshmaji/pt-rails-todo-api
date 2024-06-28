# frozen_string_literal: true

# Todo App
class ApplicationController < ActionController::Base
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection
  include ActionController::Flash

  protect_from_forgery with: :exception

end
