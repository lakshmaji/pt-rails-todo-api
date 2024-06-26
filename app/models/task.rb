# frozen_string_literal: true

# Task model
class Task < ApplicationRecord
  validates :title, presence: true

  enum status: { todo: 0, in_progress: 1, completed: 2 }, _suffix: true

  belongs_to :user

  default_scope { order(created_at: :desc) }
end