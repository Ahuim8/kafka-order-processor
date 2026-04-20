const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-producer',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

async function generateOrders() {
  await producer.connect();
  console.log('Order producer connected');

  const orders = Array.from({ length: 50 }, (_, i) => ({
    key: `order-${i}`,
    value: JSON.stringify({
      orderId: i,
      customerId: Math.floor(Math.random() * 100),
      amount: Math.floor(Math.random() * 2000) + 10,
      items: [
        {
          productId: Math.floor(Math.random() * 1000),
          quantity: Math.floor(Math.random() * 5) + 1,
        },
      ],
      timestamp: new Date().toISOString(),
      status: 'pending',
    }),
  }));

  const result = await producer.send({
    topic: 'orders',
    messages: orders,
  });

  console.log('Orders sent:', result.length, 'messages');
  await producer.disconnect();
}

generateOrders().catch(console.error);