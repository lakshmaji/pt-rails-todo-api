# frozen_string_literal: true

# Update Task use case
class UpdateTask
    def initialize(repository)
      @repository = repository
    end
  
    def execute(id, task_params)
      task = TaskEntity.new(task_params)
  
      raise ValidationError, task.errors unless task.valid?
  
      @repository.update(id, task_params)
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