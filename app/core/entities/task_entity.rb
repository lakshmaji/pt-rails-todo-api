# frozen_string_literal: true

# Task entity
class TaskEntity
  include ActiveModel::Model

  attr_accessor :id, :title, :description, :user_id, :status

  TODO = 1
  IN_PROGRESS = 2
  DONE = 3

  STATUSES = {
    TODO => 'todo',
    IN_PROGRESS => 'in progress',
    DONE => 'completed'
  }.freeze

  validates :title, presence: true
  validates_inclusion_of :status, in: STATUSES.keys,
                                  message: "{{value}} must be in #{STATUSES.keys.join(', ')}"

  def initialize(attributes = {})
    super
    @status ||= TODO # Default status if not provided
  end

  def human_readable_status
    STATUSES[status] || 'unknown status'
  end

  def save
    raise NotImplementedError, 'Cannot save TaskEntity directly'
  end
end