# frozen_string_literal: true

# Update Task use case
class UpdateTask
  def initialize(repository)
    @repository = repository
  end

  def execute(id, task_params)
    task = @repository.find(id)
    task_entity = TaskEntity.new(task_params)

    raise ValidationError, task_entity.errors unless task_entity.valid?

    updated_attributes = task.attributes.merge(task_params.slice(:title, :description, :status))

    @repository.update(id, updated_attributes)
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