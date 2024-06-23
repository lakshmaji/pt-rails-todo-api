# frozen_string_literal: true

require 'swagger_helper'

RSpec.describe 'auth', type: :request do
  let!(:client_app) do
    Doorkeeper::Application.create!(name: 'Test App', redirect_uri: 'urn:ietf:wg:oauth:2.0:oob', uid: 'webapp_id',
                                    secret: 'webapp_secret')
  end

  path '/auth/signup' do
    post 'Register a user' do
      tags 'Authentication'
      consumes 'application/json'

      parameter name: :register_params, in: :body, schema: {
                                                     type: :object,
                                                     properties: {
                                                       user: {
                                                         type: :object,
                                                         properties: {
                                                           email: { type: :string },
                                                           password: { type: :string },
                                                           password_confirmation: { type: :string }
                                                         },
                                                         required: %w[email password password_confirmation]
                                                       },
                                                       client_id: {
                                                         type: :string,
                                                         example: 'webapp_id'
                                                       }
                                                     },
                                                     required: %w[user client_id]
                                                   },
                required: true

      request_body_example value: {
        user: {
          email: 'user@example.com',
          password: 'password',
          password_confirmation: 'password'
        },
        client_id: 'webapp_id'
      }, name: '1', summary: 'Success 201'

      response '201', 'user created' do
        let(:register_params) do
          {
            user: {
              email: 'user@example.com',
              password: 'password',
              password_confirmation: 'password'
            },
            client_id: 'webapp_id'
          }
        end

        run_test! do |response|
          expect(response).to have_http_status(:created)
        end
      end

      response '422', 'invalid request' do
        let(:register_params) { { user: { email: 'user@example.com' }, client_id: 'webapp_id' } }
        request_body_example value: {
          user: {
            email: 'user@example.com'
          }
        }, name: 2, summary: 'Duplicate or Missing body 422'
        run_test! do |response|
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end
end
