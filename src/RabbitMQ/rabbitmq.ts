import amqp from 'amqplib';
export const EXCHANGE_NAME = 'treegrid_updates';
export const QUEUE_NAME = 'treegrid_queue';
export const ROUTING_KEY = '';
export const rabbitmqConfig = {
  protocol: 'amqp',
  hostname: 'localhost',
  port: 5672,
  username: 'guest',
  password: 'guest',
  vhost: '/',
  authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL'],
};
export const connectToRabbitMQ = async () => {
  const connection = await amqp.connect(rabbitmqConfig);
  const channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });
  await channel.assertQueue(QUEUE_NAME);
  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);
  console.log('Connected to RabbitMQ');
  return channel;
};

export const publishToRabbitMQ = async (data: any) => {
  channel.publish(EXCHANGE_NAME, ROUTING_KEY, Buffer.from(JSON.stringify(data)));
};

export const consumeFromRabbitMQ = async (callback: (data: any) => void) => {
  channel.consume(QUEUE_NAME, data => {
    callback(JSON.parse(data?.content.toString() || ''));
  });
};

export const closeRabbitMQConnection = async () => {
  await channel.close();
};

export const channel = await connectToRabbitMQ();
