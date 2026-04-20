const {Kafka} = require ('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({groupId: 'valid-orders-consumer'});

async function consumeValidOrders(){
    await consumer.connect();
    console.log('Valid Orders consumer connected');


    await consumer.subscribe({topic: 'valid-orders', fromBeginning: true});
    console.log('Subscribed to valid-order');

    let count = 0;

    await consumer.run({
        eachMessage: async ({topic , partition, message}) => {
            count++;
            const order = JSON.parase(message.value.toString());
            console.log(`[${count}] Valid order:`),{
                orderId: order.orderId,
                amount: order.amount,
                validateAt: order.validateAt,
            }
        }
    })
}consumeValidOrders().catch(console.error);