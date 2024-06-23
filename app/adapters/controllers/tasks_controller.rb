# frozen_string_literal: true

# Tasks controller
class TasksController < ActionController::API
  before_action :doorkeeper_authorize!

  def create
    create_task = CreateTask.new(TaskRepository.new)
    begin
      task = create_task.execute(task_params, doorkeeper_token.resource_owner_id)
      render json: task, status: :created
    rescue CreateTask::ValidationError => e
      render json: { errors: e.errors }, status: :unprocessable_entity
    end
  end

  def index
    posts = ListTasks.new(TaskRepository.new).execute
    render json: posts
  end

  def destroy
    task_repository = TaskRepository.new
    begin
      DeleteTask.new(task_repository).execute(params[:id].to_i)
      render json: { message: 'Task deleted successfully' }, status: :no_content
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'No task found' }, status: :not_found
    end
  end

  def update
    task_repository = TaskRepository.new
    begin
      task = UpdateTask.new(task_repository).execute(params[:id].to_i, task_params)
      render json: { task:, message: 'Task updated successfully' }, status: :ok
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