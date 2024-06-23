# frozen_string_literal: true

require 'swagger_helper'
RSpec.describe 'auth', type: :request do
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
                                                           password_confirmation: { type: :string },
                                                           first_name: { type: :string },
                                                           last_name: { type: :string }
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

      let!(:token) { token_scopes('public manage') }
      request_body_example value: {
        user: {
          email: 'user@example.com',
          password: 'password',
          password_confirmation: 'password',
          first_name: 'L',
          last_name: 'M'
        },
        client_id: 'webapp_id'
      }, name: '1', summary: 'Success 201'

      response '201', 'user created' do
        let(:register_params) do
          {
            user: {
              email: 'user@example.com',
              password: 'password',
              password_confirmation: 'password',
              first_name: 'L',
              last_name: 'M'
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

  path '/me' do
    get 'Get current user' do
      tags 'User Profile'
      produces 'application/json'
      security [bearer_auth: []]

      response '200', 'user found' do
        let(:token) { token_scopes('public manage') }

        let(:Authorization) { "Bearer #{token.token}" }

        schema type: :object,
               properties: {
                 id: { type: :integer },
                 email: { type: :string },
                 first_name: { type: :string },
                 last_name: { type: :string }
               }

        run_test! do
          expect(response).to have_http_status(:ok)
        end
      end

      response '401', 'user not authorized' do
        let(:Authorization) { 'Bearer invalid_token' }

        run_test!
      end
    end
  end
end
