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
    Task.find_by(id:)
  end

  def update(id, task_params)
    task = find(id)
    task&.update(task_params)
    task
  end

  def destroy(id)
    task = find(id)
    task&.destroy
    task
  end
end
