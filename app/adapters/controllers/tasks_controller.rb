# frozen_string_literal: true

# Tasks controller
class TasksController < ApplicationController
  before_action :doorkeeper_authorize!

  def initialize(*args)
    super
    @task_repository = TaskRepository.new
  end

  def create
    create_task = CreateTask.new(@task_repository)
    begin
      task = create_task.execute(task_params, doorkeeper_token.resource_owner_id)
      render json: TaskSerializer.new(task).serializable_hash.to_json, status: :created
    rescue CreateTask::ValidationError => e
      render json: { errors: e.errors }, status: :unprocessable_entity
    end
  end

  def index
    page = params[:page] || 1
    per_page = params[:per_page] || 10
    status = params[:status]

    result = ListTasks.new(@task_repository).execute(page:, per_page:, status:)
    tasks = result[:tasks]
    total_count = result[:total_count]

    render json: PaginationSerializer.new(tasks, total_count:).serializable_hash.to_json
  end

  def destroy
    task_repository = @task_repository
    begin
      DeleteTask.new(task_repository).execute(params[:id].to_i)
      render json: { message: 'Task deleted successfully' }, status: :no_content
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'No task found' }, status: :not_found
    end
  end

  def update
    task_repository = @task_repository
    begin
      task = UpdateTask.new(task_repository).execute(params[:id].to_i, task_params)
      render json: TaskSerializer.new(task).serializable_hash.merge(message: 'Task updated successfully'),
             status: :ok
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'No task found' }, status: :not_found
    rescue UpdateTask::ValidationError => e
      render json: { errors: e.errors }, status: :unprocessable_entity
    rescue StandardError => e
      Rails.logger.error("Failed to update task: #{e.message}")
      render json: { error: 'Failed to update task' }, status: :internal_server_error
    end
  end

  private

  def task_params
    params.require(:task).permit(:title, :description, :status)
  end
end