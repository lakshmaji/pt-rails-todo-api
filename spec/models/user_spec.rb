# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_presence_of(:password) }
    it { is_expected.to validate_presence_of(:first_name) }
    it { is_expected.to validate_presence_of(:last_name) }
  end

  describe 'database columns' do
    it { is_expected.to have_db_column(:email).of_type(:string) }
    it { is_expected.to have_db_column(:encrypted_password).of_type(:string) }
  end

  describe 'Devise modules' do
    it 'includes database_authenticatable' do
      expect(described_class.devise_modules).to include(:database_authenticatable)
    end

    it 'includes registerable' do
      expect(described_class.devise_modules).to include(:registerable)
    end

    it 'includes recoverable' do
      expect(described_class.devise_modules).to include(:recoverable)
    end

    it 'includes rememberable' do
      expect(described_class.devise_modules).to include(:rememberable)
    end

    it 'includes validatable' do
      expect(described_class.devise_modules).to include(:validatable)
    end
  end

  describe '.authenticate!' do
    let!(:user) { create(:user, email: 'test@example.com', password: 'password') }

    context 'with valid credentials' do
      it 'returns the user' do
        authenticated_user = described_class.authenticate!('test@example.com', 'password')
        expect(authenticated_user).to eq(user)
      end
    end

    context 'with invalid credentials' do
      it 'returns nil' do
        authenticated_user = described_class.authenticate!('test@example.com', 'wrong_password')
        expect(authenticated_user).to be_nil
      end
    end

    context 'with non-existing email' do
      it 'returns nil' do
        authenticated_user = described_class.authenticate!('nonexistent@example.com', 'password')
        expect(authenticated_user).to be_nil
      end
    end
  end
end
