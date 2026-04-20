# Kafka Order Processor

A practical order processing system using Apache Kafka and Node.js.

## Architecture

- **Producer** (`producer.js`) — Generates 50 random orders to the `orders` topic
- **Validator** (`validator.js`) — Reads orders, validates (amount, customer, items), routes to `valid-orders` or `invalid-orders`
- **Consumers** — Read from valid/invalid topics for downstream processing

## Topics

- `orders` — Raw orders from users
- `valid-orders` — Orders that passed validation
- `invalid-orders` — Orders that failed validation
- `shipments` — (future) Orders ready to ship

## Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 16+

### Start Kafka
```bash
docker-compose up -d
```

### Create Topics
```bash
bash setup-topics.sh
```

### Install Dependencies
```bash
npm install
```

## Running the System

### 1. Start the Validator
```bash
node validator.js
```

### 2. In another terminal, run the Producer
```bash
node producer.js
```

### 3. Consume Valid Orders
```bash
node consumer-valid-orders.js
```

### 4. Consume Invalid Orders
```bash
node consumer-invalid-orders.js
```

## How It Works

1. Producer generates orders with random amounts, customers, and items
2. Validator reads each order and checks:
   - Amount is between $0 and $10,000
   - Customer ID exists
   - Order has at least 1 item
3. Valid orders → `valid-orders` topic
4. Invalid orders → `invalid-orders` topic
5. Consumers read from respective topics for further processing

## Key Concepts Demonstrated

- **Topics & Partitions** — 3 partitions per topic for parallelism
- **Producers** — Send data without waiting for consumers
- **Consumers** — Read data at their own pace
- **Stream Processing** — Validate and route messages in real-time
- **Stateless Transformation** — No state needed between messages