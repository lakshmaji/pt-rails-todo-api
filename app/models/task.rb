# frozen_string_literal: true

# Task model
class Task < ApplicationRecord
  validates :title, presence: true
  belongs_to :user
end
