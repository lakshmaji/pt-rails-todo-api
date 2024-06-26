# frozen_string_literal: true

# Task entity
class TaskEntity
  include ActiveModel::Model

  attr_accessor :id, :title, :description, :user_id, :status

  validates :title, presence: true
  validate :validate_status

  def initialize(attributes = {})
    super
  end

  def save
    raise NotImplementedError, 'Cannot save TaskEntity directly'
  end

  def self.human_readable_status(status)
    case status
    when 'todo'
      'todo'
    when 'in_progress'
      'in progress'
    when 'completed'
      'Done'
    else
      status
    end
  end

  private

  def validate_status
    return if status.nil? || Task.statuses.key?(status.to_sym)

    errors.add(:status, 'is not valid')
  end
end