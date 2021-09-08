docker rm home-budget-dev-db
docker run --name home-budget-dev-db -p 27017:27017 -d mongo:latest