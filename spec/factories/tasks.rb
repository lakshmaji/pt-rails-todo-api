# frozen_string_literal: true

FactoryBot.define do
  factory :task do
    sequence(:title) { |n| "Task #{n}" }
    description { 'Task description' }
    status { 0 }
    association :user, factory: :user
  end
end