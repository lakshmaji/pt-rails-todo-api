# frozen_string_literal: true

# List Tasks use case
class ListTasks
  def initialize(repository)
    @repository = repository
  end

  def execute(page:, per_page:, status: nil)
    tasks = @repository.all(status:).page(page).per(per_page)
    total_count = @repository.all(status:).count
    { tasks:, total_count: }
  end
end