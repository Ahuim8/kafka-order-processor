const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'invalid-orders-consumer' });

async function consumeInvalidOrders() {
  await consumer.connect();
  console.log('Invalid orders consumer connected');

  await consumer.subscribe({ topic: 'invalid-orders', fromBeginning: true });
  console.log('Subscribed to invalid-orders');

  let count = 0;

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      count++;
      const order = JSON.parse(message.value.toString());
      console.log(`[${count}] Invalid order:`, {
        orderId: order.orderId,
        reason: order.validationReason,
        validatedAt: order.validatedAt,
      });
    },
  });
}

consumeInvalidOrders().catch(console.error);