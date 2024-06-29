# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
file_path = Rails.root.join('db/todos.json')
json_data = File.read(file_path)

Doorkeeper::Application.find_or_create_by(name: 'Web APP') do |app|
  app.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'
  app.secret = 'web_app_secret'
  app.uid = 'webapp_id'
  app.save!
end

Doorkeeper::Application.find_or_create_by(name: 'Mobile App') do |app|
  app.redirect_uri = 'http://localhost:3000/callback'
  app.secret = 'mapp_secret'
  app.uid = 'mapp_id'
  app.confidential  = false
  app.save!
end


user = User.create(
  {
    "id": '1',
    "email": 'user@example.com',
    "first_name": 'L',
    "last_name": 'M',
    password: 'password'
  }
)

records = JSON.parse(json_data).map(&:with_indifferent_access)

records.each do |record|
  Task.create!(title: record[:title], description: record[:description], status: record[:status], user_id: user.id)
end
