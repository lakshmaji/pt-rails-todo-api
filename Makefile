.PHONY: database dev_server

MYSQL_HOST = 127.0.0.1
MYSQL_PORT = 3308

define wait_for_mysql
    $(eval $@_WAIT_TIMEOUT = $(1))
	@echo "Waiting for MySQL service to be ready..."
	@timeout=$($@_WAIT_TIMEOUT); \
	while ! nc -z $(MYSQL_HOST) $(MYSQL_PORT); do \
		sleep 1; \
		timeout=$$((timeout - 1)); \
		if [ $$timeout -le 0 ]; then \
			echo "MySQL service did not start within $($@_WAIT_TIMEOUT) seconds."; \
			exit 1; \
		fi; \
	done
	echo "MySQL service is ready."
endef

say_hello:
	@echo "Development scripts"
	@echo "  	docs    	- Generate API docs"
	@echo "  	user_token    	- Generate token for test user"
	@echo "  	database    	- Setup dev database (not recommended)"
	@echo "  	serve    		- Launch server"
	@echo "  	setup_db    	- Setup DB"
docs:
	bin/rails rswag:specs:swaggerize
user_token:
	bash ./dev/scripts/gen_token.sh
database:
	bin/rails db:drop
	bin/rails db:create
	bin/rails db:migrate
	bin/rails db:seed
setup_db:
	docker compose -f docker-compose.db.yml up -d
	@$(call wait_for_mysql, 60)
	$(MAKE) database
serve:
	@$(call wait_for_mysql, 60)
	RUBY_DEBUG_OPEN=true bin/rails s -p 3001
specs:
	bundle exec rspec
docker_dev:
	docker compose up