# frozen_string_literal: true

# Create Task use case
class CreateTask
  def initialize(repository)
    @repository = repository
  end

  def execute(task_params)
    task = Entities::Task.new(task_params)
    @repository.save(title: task.title, description: task.description, status: 0)
  end
end
