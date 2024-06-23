# frozen_string_literal: true

FactoryBot.define do
  factory :task do
    title { 'My Task' }
    description { 'Task description' }
    status { 1 }
  end
end
