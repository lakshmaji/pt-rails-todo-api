# frozen_string_literal: true

# Outside clean arch, rails specific imple
class TaskRepository
  def save(task_params)
    Task.create(task_params)
  end

  def all
    Task.all
  end

  def find(id)
    Task.find(id)
  end

  def update(id, task_params)
    Task.update(id, task_params)
  end

  def destroy(id)
    Task.destroy(id)
  end
end