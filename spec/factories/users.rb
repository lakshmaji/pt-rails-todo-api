# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    email { 'test@example.com' }
    password { 'password' }
    password_confirmation { 'password' }
    first_name { 'L' }
    last_name { 'M' }
  end
end
