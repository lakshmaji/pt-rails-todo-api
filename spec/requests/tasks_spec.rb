# frozen_string_literal: true

require 'swagger_helper'
RSpec.describe 'Tasks', type: :request do
  path '/task' do
    post 'Create a task' do
      tags 'Tasks'
      consumes 'application/json'
      produces 'application/json'
      security [bearer_auth: []]

      parameter name: :register_params, in: :body, schema: {
                                                     type: :object,
                                                     properties: {
                                                       title: { type: :string },
                                                       description: { type: :string }
                                                     },
                                                     required: %w[title]
                                                   },
                required: true

      let(:token) { token_scopes('public manage') }

      let(:Authorization) { "Bearer #{token.token}" }

      request_body_example value: {
        title: 'Some title',
        description: 'password'
      }, name: '1', summary: 'Success 201'

      response '201', 'task created' do
        let(:register_params) do
          {
            title: 'user@example.com',
            description: 'password'
          }
        end

        run_test! do |response|
          expect(response).to have_http_status(:created)
        end
      end
    end
  end
end
