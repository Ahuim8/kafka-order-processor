const {Kafka} = require ('kafkajs');

const kafka = new Kafka({
    clientId: 'order-validator',
    brokers: ['localhost:9092'],
})

const consumer = kafka.consumer({ groupId: 'validator-group'});
const producer = kafka.producer();

async function validateOrders(){
    await consumer.connect();
    await producer.connect();
    console.log('Order validator started');

    await consumer.subscribe({topic:'orders', fromBeginning:false});

    await consumer.run({
        eachMessage: async ({topic, partition, message}) =>{
            const order = JSON.parse(message.value.toString());

            const isValid =
                order.amount > 0 &&
                order.amount < 10000 &&
                order.customerId &&
                order.items.length > 0;

            const targetTopic  = isValid? 'valid-orders' : 'invalid-orders';
            const reason = !isValid ? 'Invalid order data' : null;

            await producer.send({
                topic: targetTopic,
                message:[
                    {
                        key: message.key,
                        value: JSON.stringify({
                            ...order,
                            validated: true,
                            validationReason: reason,
                            validatedAt: newDate().toISOString(),
                        }),
                    },
                ],
            });
            console.log(`Order ${order.orderId}: ${isValid ? 'VALID' : 'INVALID'} -> ${targetTopic}`)
        }
    })
}
validateOrders().catch(console.error);