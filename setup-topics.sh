docker-compose exec kafka kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --topic orders \
  --partitions 3 \
  --replication-factor 1

docker-compose exec kafka kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --topic valid-orders \
  --partitions 3 \
  --replication-factor 1

docker-compose exec kafka kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --topic invalid-orders \
  --partitions 3 \
  --replication-factor 1

docker-compose exec kafka kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --topic shipments \
  --partitions 3 \
  --replication-factor 1
  