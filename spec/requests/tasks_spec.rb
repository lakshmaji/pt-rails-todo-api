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

    path '/task/{id}' do
      delete 'Delete task' do
        tags 'Tasks'
        consumes 'application/json'
        produces 'application/json'
        security [bearer_auth: []]
        parameter name: :id, in: :path, type: :integer
        request_body_example value: { some_field: '123' }, name: 'basic', summary: 'Delete task by id'

        response '204', 'delete task' do
          let(:token) { token_scopes('public manage') }

          let(:Authorization) { "Bearer #{token.token}" }
          let(:task) { create(:task) }
          let(:id) { task.id }

          run_test! do
            expect(response).to have_http_status(:no_content)
            expect(Task).not_to exist(task.id)
          end
        end

        response '404', 'task not found' do
          let(:token) { token_scopes('public manage') }
          let(:Authorization) { "Bearer #{token.token}" }

          let(:id) { 'invalid' }

          run_test! do
            expect(response).to have_http_status(:not_found)
            expect(response.body).to match(/no task found/i)
          end
        end
      end
    end
    path '/task/{id}' do
      put 'Update task' do
        tags 'Tasks'
        consumes 'application/json'
        produces 'application/json'
        security [bearer_auth: []]

        parameter name: :id, in: :path, type: :integer
        parameter name: :task_params, in: :body, required: false, schema: {
          type: :object,
          properties: {
            title: { type: :string },
            description: { type: :string },
            status: {
              type: :integer,
              enum: [1, 2, 3],
              description: '1 for TODO, 2 for IN_PROGRESS, 3 for DONE'
            }
          }
        }

        response '200', 'update title, description' do
          let(:token) { token_scopes('public manage') }
          let(:Authorization) { "Bearer #{token.token}" }
          let(:task) { create(:task) }
          let(:id) { task.id }

          let(:task_params) do
            {
              title: 'Updated title',
              description: 'Updated description'
            }
          end
          request_body_example value: {
            title: 'New title',
            description: 'New description'
          }, name: 'task_title_desc', summary: 'Update task by id'

          schema type: :object,
                 properties: {
                   message: { type: :string },
                   task: {
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
                 }

          run_test! do |response|
            expect(response).to have_http_status(:ok)
            expect(Task.find(task.id).attributes).to include('title' => 'Updated title')
          end
        end

        response '200', 'update status' do
          let(:token) { token_scopes('public manage') }
          let(:Authorization) { "Bearer #{token.token}" }
          let(:task) { create(:task) }
          let(:id) { task.id }

          let(:task_params) do
            {
              title: task.title,
              status: 2
            }
          end
          request_body_example value: {
            status: 3
          }, name: 'task_status', summary: 'Update task status. Allowed values 1 = Todo, 2= In Progress, 3 Completed'
          schema type: :object,
                 properties: {
                   message: { type: :string },
                   task: {
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
                 }

          run_test! do |response|
            expect(response).to have_http_status(:ok)
            expect(Task.find(task.id).attributes).to include('status' => TaskEntity::IN_PROGRESS)
          end
        end

        response '404', 'task not found' do
          let(:token) { token_scopes('public manage') }
          let(:Authorization) { "Bearer #{token.token}" }

          let(:id) { 'invalid' }
          let(:task_params) do
            {
              title: 'Updated title',
              description: 'Updated description'
            }
          end

          run_test! do
            expect(response).to have_http_status(:not_found)
            expect(response.body).to match(/no task found/i)
          end
        end

        response '500', 'failed to update task' do
          let(:token) { token_scopes('public manage') }
          let(:Authorization) { "Bearer #{token.token}" }
          let(:task) { create(:task) }
          let(:id) { task.id }

          let(:task_params) do
            {}
          end

          request_body_example value: {}, name: 'task_no_data', summary: 'Update task with no info'

          run_test! do
            expect(response).to have_http_status(:internal_server_error)
            expect(response.body).to match(/Failed to update task/i)
          end
        end
      end
    end
  end
end