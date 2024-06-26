# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ListTasks do
  let(:list_tasks) { described_class.new(repository) }

  let(:repository) { TaskRepository.new }

  describe '#execute' do
    it 'returns paginated tasks from the repository' do
      tasks = create_list(:task, 5)
      result = list_tasks.execute(page: 1, per_page: 3)

      expect(result[:tasks]).to match_array(tasks.sort { |a, b| b.created_at <=> a.created_at }.first(3))
      expect(result[:total_count]).to eq(5)
    end

    it 'returns the correct number of tasks per page' do
      create_list(:task, 5)
      result = list_tasks.execute(page: 1, per_page: 4)

      expect(result[:tasks].size).to eq(4)
      expect(result[:total_count]).to eq(5)
    end

    it 'returns filtered tasks by status' do
      create_tasks_with_statuses(completed: 6, todo: 3, in_progress: 5)
      completed_tasks = Task.where(status: :completed)
      result = list_tasks.execute(page: 1, per_page: 10, status: :completed)

      expect(result[:tasks]).to match_array(completed_tasks)
      expect(result[:total_count]).to eq(6)
    end
  end
end

private

def create_tasks_with_statuses(statuses)
  statuses.each do |status, count|
    create_list(:task, count, status:)
  end
end
