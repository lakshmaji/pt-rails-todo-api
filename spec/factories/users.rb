# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:email) { |n| Faker::Internet.email.gsub('@', "-#{n}@") }
    password { 'password' }
    password_confirmation { 'password' }
    first_name { 'L' }
    last_name { 'M' }
  end
end
