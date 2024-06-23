# frozen_string_literal: true

module Entities
  # Task entity
  class Task
    attr_accessor :id, :title, :description, :user_id, :status

    def initialize(attributes = {})
      @id = attributes[:id]
      @title = attributes[:title]
      @description = attributes[:description]
      @user_id = attributes[:user_id]
      @status = attributes[:status]
    end
  end
end
