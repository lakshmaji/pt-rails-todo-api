# frozen_string_literal: true

module AccessTokenHelper
  APP_NAME = 'app name'
  REDIRECT_URL =  'https://host.name/oauth/callback'

  def token_scopes(scopes)
    app = Doorkeeper::Application.create!(name: 'Test App', redirect_uri: 'urn:ietf:wg:oauth:2.0:oob', uid: 'webapp_id',
                                          secret: 'webapp_secret')
    user = create(:user)
    # Doorkeeper::AccessToken.create!(application_id: app.id, resource_owner_id: user.id, scopes:)
    Doorkeeper::AccessToken.find_or_create_for(
      resource_owner: user.id,
      application: app,
      refresh_token: SecureRandom.hex(32),
      expires_in: Doorkeeper.configuration.access_token_expires_in.to_i,
      scopes:
    )
  end
end

RSpec.configure do |config|
  config.include AccessTokenHelper
end
