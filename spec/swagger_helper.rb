# frozen_string_literal: true

require 'rails_helper'

RSpec.configure do |config|
  # Specify a root folder where Swagger JSON files are generated
  # NOTE: If you're using the rswag-api to serve API descriptions, you'll need
  # to ensure that it's configured to serve Swagger from the same folder
  config.openapi_root = Rails.root.join('swagger').to_s

  # Define one or more Swagger documents and provide global metadata for each one
  # When you run the 'rswag:specs:swaggerize' rake task, the complete Swagger will
  # be generated at the provided relative path under openapi_root
  # By default, the operations defined in spec files are added to the first
  # document below. You can override this behavior by adding a openapi_spec tag to the
  # the root example_group in your specs, e.g. describe '...', openapi_spec: 'v2/swagger.json'
  config.openapi_specs = {
    'v1/swagger.yaml' => {
      openapi: '3.0.1',
      info: {
        title: 'API V1',
        version: 'v1',
        description: 'This is the first version of todo API'
      },
      paths: {
        '/oauth/token' => {
          post: {
            tags: ['Authentication'],
            summary: 'Obtain OAuth2 token',
            description: 'Obtain an OAuth2 token using Doorkeeper',
            requestBody: {
              required: true,
              content: {
                'application/x-www-form-urlencoded' => {
                  schema: {
                    type: :object,
                    properties: {
                      grant_type: { type: :string,
                                    example: 'password',
                                    description: "Grant type \
                                    (e.g., password, client_credentials, refresh_token, authorization_code)" },
                      client_id: { type: :string, description: 'Client ID' },
                      client_secret: { type: :string, description: 'Client Secret' },
                      email: { type: :string, description: 'Email (required for password grant type)' },
                      password: { type: :string, description: 'Password (required for password grant type)' },
                      refresh_token: { type: :string,
                                       description: 'Refresh token (required for refresh_token grant type)' },
                      code: { type: :string,
                              description: 'Authorization code (required for authorization_code grant type)' },
                      redirect_uri: { type: :string,
                                      description: 'Redirect URI (required for authorization_code grant type)' }
                    },
                    required: ['grant_type']
                  }
                },
                'application/json' => {
                  schema: {
                    type: :object,
                    properties: {
                      grant_type: { type: :string, example: 'password',
                                    description: "Grant type \
                                    (e.g., password, client_credentials, refresh_token, authorization_code)" },
                      client_id: { type: :string, description: 'Client ID' },
                      client_secret: { type: :string, description: 'Client Secret' },
                      username: { type: :string, description: 'Username (required for password grant type)' },
                      password: { type: :string, description: 'Password (required for password grant type)' },
                      refresh_token: { type: :string,
                                       description: 'Refresh token (required for refresh_token grant type)' },
                      code: { type: :string,
                              description: 'Authorization code (required for authorization_code grant type)' },
                      redirect_uri: { type: :string,
                                      description: 'Redirect URI (required for authorization_code grant type)' }
                    },
                    required: ['grant_type']
                  }
                }
              }
            },
            responses: {
              '200': {
                description: 'OAuth2 token response',
                content: {
                  'application/json' => {
                    schema: {
                      type: :object,
                      properties: {
                        access_token: { type: :string, description: 'Access token' },
                        token_type: { type: :string, description: 'Token type' },
                        expires_in: { type: :integer, description: 'Expiration time in seconds' },
                        refresh_token: { type: :string, description: 'Refresh token' },
                        scope: { type: :string, description: 'Scope of the access token' },
                        created_at: { type: :integer, description: 'Token creation timestamp' }
                      }
                    }
                  }
                }
              },
              '400': {
                description: 'Invalid request',
                content: {
                  'application/json' => {
                    schema: {
                      type: :object,
                      properties: {
                        error: { type: :string, description: 'Error message' },
                        error_description: { type: :string, description: 'Error description' }
                      }
                    }
                  }
                }
              }
            }
          }
        },

        '/oauth/revoke' => {
          post: {
            tags: ['Authentication'],
            summary: 'Revoke OAuth2 token',
            description: 'Revoke an OAuth2 token using Doorkeeper',
            requestBody: {
              required: true,
              content: {
                'application/x-www-form-urlencoded' => {
                  schema: {
                    type: :object,
                    properties: {
                      token: { type: :string, description: 'The token to be revoked' },
                      client_id: { type: :string, description: 'Client ID' },
                      client_secret: { type: :string, description: 'Client Secret' }
                    },
                    required: %w[token client_id client_secret]
                  }
                },
                'application/json' => {
                  schema: {
                    type: :object,
                    properties: {
                      token: { type: :string, description: 'The token to be revoked' },
                      client_id: { type: :string, description: 'Client ID' },
                      client_secret: { type: :string, description: 'Client Secret' }
                    },
                    required: %w[token client_id client_secret]
                  }
                }
              }
            },
            responses: {
              '200': {
                description: 'Token revoked successfully',
                content: {
                  'application/json' => {
                    schema: {
                      type: :object,
                      properties: {
                        message: { type: :string, example: 'Token revoked successfully' }
                      }
                    }
                  }
                }
              },
              '400': {
                description: 'Invalid request',
                content: {
                  'application/json' => {
                    schema: {
                      type: :object,
                      properties: {
                        error: { type: :string, description: 'Error message' },
                        error_description: { type: :string, description: 'Error description' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      servers: [
        {
          url: '{protocol}://{defaultHost}',
          variables: {
            defaultHost: {
              default: 'localhost:3001'
            },
            protocol: {
              default: 'http'
            }
          }
        },
        {
          url: 'http://localhost:3001',
          description: 'Local server'
        }
      ],
      components: {
        securitySchemes: {
          bearer_auth: {
            type: :http,
            scheme: :bearer
          }
        }
      }

    }
  }

  # Specify the format of the output Swagger file when running 'rswag:specs:swaggerize'.
  # The openapi_specs configuration option has the filename including format in
  # the key, this may want to be changed to avoid putting yaml in json files.
  # Defaults to json. Accepts ':json' and ':yaml'.
  config.openapi_format = :yaml
end
