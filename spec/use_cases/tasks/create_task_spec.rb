# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CreateTask, type: :use_case do
  let(:task_repository) { instance_double(TaskRepository) }
  let(:user) { create(:user) }
  let(:create_task) { described_class.new(task_repository) }
  let(:task_params) { { title: 'Sample Todo', description: 'This is a sample content.' } }
  let(:model_task) { Task.new(task_params) }

  it 'creates a task' do
    task = Task.new(task_params)
    allow(task_repository).to receive(:save).with(description: task[:description], status: 0,
                                                  title: task[:title]).and_return(model_task)

    result = create_task.execute(task_params)
    expect(result).to be_a(Task)
  end
end
