# frozen_string_literal: true

# Delete Tasks use case
class DeleteTask
    def initialize(repository)
      @repository = repository
    end
  
    def execute(id)
      @repository.destroy(id)
    end
end