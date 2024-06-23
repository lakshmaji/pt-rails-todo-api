# frozen_string_literal: true

# Create Task use case
class CreateTask
  def initialize(repository)
    @repository = repository
  end

  def execute(task_params, user_id)
    task = Entities::Task.new(task_params.merge(user_id:))
    @repository.save(title: task.title, description: task.description, status: 0, user_id: task.user_id)
  end
end
