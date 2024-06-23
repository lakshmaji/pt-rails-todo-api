# frozen_string_literal: true

# Task model
class Task < ApplicationRecord
  validates :title, presence: true
end
