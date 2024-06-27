# frozen_string_literal: true

# List Tasks use case
class ListTasks
  def initialize(repository)
    @repository = repository
  end

  def execute(user_id:, page:, per_page:, status: nil)
    tasks = @repository.by_user(user_id:, status:).page(page).per(per_page)
    total_count = @repository.by_user(user_id:, status:).count
    { tasks:, total_count: }
  end
end
