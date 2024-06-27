# frozen_string_literal: true

require 'swagger_helper'
RSpec.describe 'Tasks API', type: :request do # rubocop:disable RSpec/MultipleMemoizedHelpers
  path '/v1/tasks' do
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

        schema type: :object,
               properties: {
                 data: {
                   type: :object,
                   properties: {
                     id: { type: :string },
                     type: { type: 'task' },
                     attributes: {
                       type: :object,
                       properties: {
                         id: { type: :integer },
                         title: { type: :string },
                         description: { type: :string },
                         user_id: { type: :integer },
                         created_at: { type: :string, format: :datetime },
                         updated_at: { type: :string, format: :datetime },
                         status: {
                           type: :string,
                           enum: %w[todo in_progress completed],
                           description: 'todo, in_progress, completed'
                         }
                       }
                     }
                   }
                 }
               }
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
  end

  path '/v1/tasks' do
    get 'Get tasks' do
      tags 'Tasks'
      consumes 'application/json'
      produces 'application/json'
      security [bearer_auth: []]
      parameter name: :page, in: :query, type: :integer, required: false, description: 'Page number'
      parameter name: :per_page, in: :query, type: :integer, required: false, description: 'Tasks per page'
      parameter name: :status, in: :query, type: :string, required: false, description: 'Tasks status'

      response '200', 'list tasks' do
        let(:token) { token_scopes('public manage') }

        let(:Authorization) { "Bearer #{token.token}" }
        let!(:todos_list) { create_list(:task, 5, user_id: token.resource_owner_id) }

        schema type: :object,
               properties: {
                 data: {
                   type: :array,
                   items: {
                     type: :object,
                     properties: {
                       id: { type: :string },
                       type: { type: :string },
                       attributes: {
                         title: { type: :string },
                         description: { type: :string },
                         user_id: { type: :integer },
                         created_at: { type: :string, format: :datetime },
                         updated_at: { type: :string, format: :datetime },
                         status: { type: :string }
                       }
                     }
                   }
                 },
                 meta: {
                   type: :object,
                   properties: {
                     total_count: { type: :integer },
                     current_page: { type: :integer },
                     total_pages: { type: :integer },
                     next_page: { type: :integer, nullable: true },
                     prev_page: { type: :integer, nullable: true },
                     per_page: { type: :integer }
                   }
                 }
               }

        example 'application/json', :task_records, {
          data: [
            {
              id: '1',
              type: 'task',
              attributes: {
                title: 'Task 1',
                description: 'Task description 1',
                user_id: 1,
                created_at: '2024-06-24T16:41:28.268Z',
                updated_at: '2024-06-24T16:41:28.268Z',
                status: 'todo'
              }
            }
          ],
          meta: {
            total_count: 5,
            current_page: 1,
            total_pages: 1,
            next_page: nil,
            prev_page: nil,
            per_page: 10
          }
        }, 'Records'

        run_test! do
          response_data = JSON.parse(response.body)
          expect(response_data['data'].size).to eq(todos_list.count)
          expect(response_data['meta']['total_count']).to eq(todos_list.size)
          expect(response_data['meta']['current_page']).to eq(1)
          expect(response_data['meta']['total_pages']).to eq(1)
          expect(response_data['meta']['per_page']).to eq(10)
        end
      end

      response '200', 'Filter tasks list' do
        let(:token) { token_scopes('public manage') }
        let(:Authorization) { "Bearer #{token.token}" }

        let!(:todos_list) do
          create_list(:task, 5, status: :todo, user_id: token.resource_owner_id)
          create_list(:task, 3, status: :completed, user_id: token.resource_owner_id)
          create_list(:task, 2, status: :in_progress, user_id: token.resource_owner_id)
        end
        let(:status) { :todo }

        schema type: :object,
               properties: {
                 data: {
                   type: :array,
                   items: {
                     type: :object,
                     properties: {
                       id: { type: :string },
                       type: { type: :string },
                       attributes: {
                         type: :object,
                         properties: {
                           title: { type: :string },
                           description: { type: :string },
                           created_at: { type: :string, format: 'date-time' },
                           updated_at: { type: :string, format: 'date-time' },
                           status: { type: :string }
                         },
                         required: %w[title description created_at updated_at status]
                       }
                     }
                   }
                 },
                 meta: {
                   type: :object,
                   properties: {
                     total_count: { type: :integer },
                     current_page: { type: :integer },
                     total_pages: { type: :integer },
                     next_page: { type: :integer, nullable: true },
                     prev_page: { type: :integer, nullable: true },
                     per_page: { type: :integer }
                   }
                 }
               }

        example 'application/json', :filtered_task_records, {
          data: [
            {
              id: '1',
              type: 'task',
              attributes: {
                title: 'Task 1',
                description: 'Task description 1',
                user_id: 1,
                created_at: '2024-06-24T16:41:28.268Z',
                updated_at: '2024-06-24T16:41:28.268Z',
                status: 'todo'
              }
            }
          ],
          meta: {
            total_count: 5,
            current_page: 1,
            total_pages: 1,
            next_page: nil,
            prev_page: nil,
            per_page: 10
          }
        }, 'Filtered records'
        run_test! do
          response_data = JSON.parse(response.body)
          expect(response_data['meta']['total_count']).to eq(5)
          expect(response_data['meta']['total_pages']).to eq(1)
        end
      end

      response '200', 'zero records' do
        let(:token) { token_scopes('public manage') }
        let(:Authorization) { "Bearer #{token.token}" }

        let(:tasks) { create_list(:task, 5) }

        example 'application/json', :no_tasks, {
          data: []
        }, 'Empty'
        run_test! do
          expect(JSON.parse(response.body)['data'].size).to eq(0)
        end
      end

      response '200', 'shouldnt include other user tasks' do
        let(:token) { token_scopes('public manage') }

        let(:Authorization) { "Bearer #{token.token}" }
        let!(:todos_list) do
          create_list(:task, 3, user_id: token.resource_owner_id)
          user = create(:user, id: 123_456_789)
          create_list(:task, 25, user_id: user.id)
        end

        schema type: :object,
               properties: {
                 data: {
                   type: :array,
                   items: {
                     type: :object,
                     properties: {
                       id: { type: :string },
                       type: { type: :string },
                       attributes: {
                         title: { type: :string },
                         description: { type: :string },
                         user_id: { type: :integer },
                         created_at: { type: :string, format: :datetime },
                         updated_at: { type: :string, format: :datetime },
                         status: { type: :string }
                       }
                     }
                   }
                 },
                 meta: {
                   type: :object,
                   properties: {
                     total_count: { type: :integer },
                     current_page: { type: :integer },
                     total_pages: { type: :integer },
                     next_page: { type: :integer, nullable: true },
                     prev_page: { type: :integer, nullable: true },
                     per_page: { type: :integer }
                   }
                 }
               }

        example 'application/json', :task_records, {
          data: [
            {
              id: '1',
              type: 'task',
              attributes: {
                title: 'Task 1',
                description: 'Task description 1',
                user_id: 1,
                created_at: '2024-06-24T16:41:28.268Z',
                updated_at: '2024-06-24T16:41:28.268Z',
                status: 'todo'
              }
            }
          ],
          meta: {
            total_count: 5,
            current_page: 1,
            total_pages: 1,
            next_page: nil,
            prev_page: nil,
            per_page: 10
          }
        }, 'Records'

        run_test! do
          response_data = JSON.parse(response.body)
          expect(response_data['data'].size).to eq(3)
          expect(response_data['meta']['total_count']).to eq(3)
          expect(Task.count).to eq(28)
        end
      end
    end
  end

  path '/v1/tasks/{id}' do
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
            enum: %w[todo in_progress completed],
            description: 'todo, in_progress, completed'
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
                 data: {
                   type: :object,
                   properties: {
                     id: { type: :string },
                     type: { type: 'task' },
                     attributes: {
                       type: :object,
                       properties: {
                         id: { type: :integer },
                         title: { type: :string },
                         description: { type: :string },
                         user_id: { type: :integer },
                         created_at: { type: :string, format: :datetime },
                         updated_at: { type: :string, format: :datetime },
                         status: {
                           type: :string,
                           enum: %w[todo in_progress completed],
                           description: 'todo, in_progress, completed'
                         }
                       }
                     }
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
            status: :in_progress
          }
        end

        request_body_example value: {
          status: :in_progress,
          title: 'Title'
        }, name: 'task_status', summary: 'Update task status. Allowed values todo, in_progress, completed'
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
                     status: { type: :string }
                   }
                 }
               }

        run_test! do |response|
          expect(response).to have_http_status(:ok)
          expect(Task.find(task.id).status).to eq('in_progress')
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

        # NOTE: this was intentionally left to demonstrate 5XX.
        request_body_example value: {}, name: 'task_no_data', summary: 'Update task with no info'

        run_test! do
          expect(response).to have_http_status(:internal_server_error)
          expect(response.body).to match(/Something went wrong at our end/i)
        end
      end
    end
  end
end
