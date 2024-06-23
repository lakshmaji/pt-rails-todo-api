# frozen_string_literal: true

module Entities
  # Task entity
  class Task
    attr_accessor :id, :title, :description, :author_id, :status

    def initialize(attributes = {})
      @id = attributes[:id]
      @title = attributes[:title]
      @description = attributes[:description]
      @author_id = attributes[:author_id]
      @status = attributes[:status]
    end
  end
end
