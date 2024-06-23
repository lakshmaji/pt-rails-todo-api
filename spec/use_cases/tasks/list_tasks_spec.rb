# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ListTasks do
  let(:list_tasks) { described_class.new(repository) }

  let(:repository) { TaskRepository.new }

  describe '#execute' do
    it 'returns tasks from the repository' do
      tasks = create_list(:task, 3)

      expect(list_tasks.execute).to match_array(tasks)
    end

    it 'returns all tasks from the repository' do
      create_list(:task, 3)

      expect(list_tasks.execute.size).to eq(3)
    end
  end
end