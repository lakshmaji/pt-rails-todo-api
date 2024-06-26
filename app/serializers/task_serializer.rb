# frozen_string_literal: true

# Serializer
class TaskSerializer
    include JSONAPI::Serializer
    set_type :task
    attributes :id, :title, :description, :status, :created_at, :updated_at
  
    attribute :status_human_readable do |task|
      TaskEntity.human_readable_status(task.status)
    end
  end