# frozen_string_literal: true

Rails.application.routes.draw do
  use_doorkeeper
  devise_for :users, only: []

  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  scope 'auth' do
    post 'signup', to: 'auth#signup'
  end
end
