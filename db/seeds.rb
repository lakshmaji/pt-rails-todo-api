# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

Doorkeeper::Application.find_or_create_by(name: 'Web APP') do |app|
  app.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'
  app.secret = 'web_app_secret'
  app.uid = 'webapp_id'
  app.save!
end


Doorkeeper::Application.find_or_create_by(name: 'Mobile App') do |app|
  app.redirect_uri = 'http://localhost:3000'
  app.secret = 'mapp_secret'
  app.uid = 'mapp_id'
  app.confidential  = false
  app.save!
end
