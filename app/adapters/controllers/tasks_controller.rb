# frozen_string_literal: true

# Tasks controller
class TasksController < ActionController::API
  before_action :doorkeeper_authorize!

  def create
    create_task = CreateTask.new(TaskRepository.new)
    task = create_task.execute(task_params, doorkeeper_token.resource_owner_id)
    render json: task, status: :created
  end

  private

  def task_params
    params.require(:task).permit(:title, :description, :user_id)
  end
end
