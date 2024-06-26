#### Notes:

1. validate docker files

   ```bash
   docker compose config
   ```

2. Run pipeline locally

   ```bash
   act push --platform ubuntu-latest=catthehacker/ubuntu:act-latest --container-architecture linux/amd64
   ```   
3. Sample credentails
   
   ```bash
     db:
        port: 3308
        host: 127.0.0.1
        user: root
        password: example
      allowed_cors_origins: localhost:3000
   ```
4. rbenv 1.2.0
   
