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
            title: 'Some title',
            description: 'password'
          }
        end

        run_test! do |response|
          expect(response).to have_http_status(:created)
        end
      end

      response '422', 'invalid request' do
        let(:register_params) { { description: 'without title' } }
        request_body_example value: {
          description: 'without title'
        }, name: 2, summary: 'Invalid input 422'
        run_test! do |response|
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end

    get 'Get tasks' do
      tags 'Tasks'
      consumes 'application/json'
      produces 'application/json'
      security [bearer_auth: []]

      response '200', 'list tasks' do
        let(:token) { token_scopes('public manage') }

        let(:Authorization) { "Bearer #{token.token}" }
        before do
          create_list(:task, 5)
        end

        schema type: :array,
               items: {
                 type: :object,
                 properties: {
                   id: { type: :integer },
                   title: { type: :string },
                   description: { type: :string },
                   user_id: { type: :integer },
                   created_at: { type: :string, format: :datetime },
                   updated_at: { type: :string, format: :datetime },
                   status: { type: :integer }
                 }
               }

        run_test! do
          expect(JSON.parse(response.body).size).to eq(5)
        end
      end

      response '200', 'zero records' do
        let(:token) { token_scopes('public manage') }
        let(:Authorization) { "Bearer #{token.token}" }

        schema type: :array,
               items: {
                 type: :object,
                 properties: {
                   id: { type: :integer },
                   title: { type: :string },
                   description: { type: :string },
                   user_id: { type: :integer },
                   created_at: { type: :string, format: :datetime },
                   updated_at: { type: :string, format: :datetime },
                   status: { type: :integer }
                 }
               }

        let(:posts) { create_list(:task, 5) }
        run_test! do
          expect(JSON.parse(response.body).size).to eq(0)
        end
      end
    end
  end
end