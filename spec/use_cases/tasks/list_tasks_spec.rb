# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ListTasks do
  let(:list_tasks) { described_class.new(repository) }

  let(:repository) { TaskRepository.new }

  describe '#execute' do
    let(:user) { create(:user, id: 123_456_789) }

    it 'returns paginated tasks from the repository' do
      tasks = create_list(:task, 5, user_id: user.id)
      result = list_tasks.execute(user_id: user.id, page: 1, per_page: 3)

      expect(result[:tasks]).to match_array(tasks.sort { |a, b| b.created_at <=> a.created_at }.first(3))
      expect(result[:total_count]).to eq(5)
    end

    it 'returns the correct number of tasks per page' do
      create_list(:task, 5, user_id: user.id)
      result = list_tasks.execute(user_id: user.id, page: 1, per_page: 4)

      expect(result[:tasks].size).to eq(4)
      expect(result[:total_count]).to eq(5)
    end

    it 'returns filtered tasks by status' do
      create_tasks_with_statuses(statuses: { completed: 6, todo: 3, in_progress: 5 }, user_id: user.id)
      completed_tasks = Task.where(status: :completed)
      result = list_tasks.execute(user_id: user.id, page: 1, per_page: 10, status: :completed)

      expect(result[:tasks]).to match_array(completed_tasks)
      expect(result[:total_count]).to eq(6)
    end

    context 'when tasks are associate to multiple users' do
      let!(:tasks) { create_list(:task, 5, user_id: user.id) }
      let!(:another_user) { create(:user) }

      before do
        create_list(:task, 12, user_id: another_user.id)
      end

      it 'has all records irrespective of users' do
        expect(Task.all.count).to eq(17)
        expect(Task.all.where(user_id: another_user.id).count).to eq(12)
      end

      it 'returns current user tasks from the repository' do
        result = list_tasks.execute(user_id: user.id, page: 1, per_page: 3)

        expect(result[:tasks]).to match_array(tasks.sort { |a, b| b.created_at <=> a.created_at }.first(3))
        expect(result[:total_count]).to eq(5)
      end

      it 'returns other user tasks from the repository' do
        result = list_tasks.execute(user_id: another_user.id, page: 1, per_page: 3)

        expect(result[:total_count]).to eq(12)
      end
    end
  end
end

private

def create_tasks_with_statuses(user_id:, statuses:)
  statuses.each do |status, count|
    create_list(:task, count, status:, user_id:)
  end
end
