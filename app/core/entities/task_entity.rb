# frozen_string_literal: true

# Task entity
class TaskEntity
  include ActiveModel::Model

  attr_accessor :id, :title, :description, :user_id, :status

  validates :title, presence: true

  def initialize(attributes = {})
    super
    @status ||= 0 # Default status if not provided
  end

  def save
    raise NotImplementedError, 'Cannot save TaskEntity directly'
  end
end
