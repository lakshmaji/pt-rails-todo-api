# frozen_string_literal: true

# List Tasks use case
class ListTasks
  def initialize(repository)
    @repository = repository
  end

  def execute
    @repository.all
  end
end