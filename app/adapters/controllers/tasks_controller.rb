# frozen_string_literal: true

# Tasks controller
class TasksController < ActionController::API
  def create
    create_task = CreateTask.new(TaskRepository.new)
    task = create_task.execute(task_params)
    render json: task
  end

  private

  def task_params
    params.require(:task).permit(:title, :description, :author_id)
  end
end
