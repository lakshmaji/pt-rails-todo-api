# frozen_string_literal: true

# Create Task use case
class CreateTask
  def initialize(repository)
    @repository = repository
  end

  def execute(task_params, user_id)
    task = TaskEntity.new(task_params.merge(user_id:))

    raise ValidationError, task.errors unless task.valid?

    @repository.save(title: task.title, description: task.description, status: 0, user_id: task.user_id)
  end

  # validation
  class ValidationError < StandardError
    attr_reader :errors

    def initialize(errors)
      @errors = errors
      super(build_error_message(errors))
    end

    private

    def build_error_message(errors)
      errors.messages.map do |field, messages|
        # messages.map { |message| { field: field.to_s.humanize, message: } }
        { field: field.to_s.humanize, message: messages.first }
      end.flatten
    end
  end
end
