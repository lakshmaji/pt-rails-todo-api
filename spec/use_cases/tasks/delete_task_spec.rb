# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DeleteTask do
  let(:delete_task) { described_class.new(repository) }

  let(:repository) { TaskRepository.new }

  describe '#execute' do
    context 'when the task exists' do
      it 'deletes the task from the repository' do
        task = create(:task)

        expect { delete_task.execute(task.id) }.to change(Task, :count).by(-1)
      end
    end

    context 'when the task does not exist' do
      it 'raises an ActiveRecord::RecordNotFound error' do
        expect { delete_task.execute(-1) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end