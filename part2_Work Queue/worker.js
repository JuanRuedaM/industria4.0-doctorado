import amqp from 'amqplib/callback_api.js';

amqp.connect('amqp://localhost', (error, connection) => {
  connection.createChannel((error, channel) => {
    let queue = 'task_queue';

    channel.assertQueue(queue, {
      // if the server went down, it mantains data anyways
      durable: true
    });
    // This tells RabbitMQ not to give more than one message to a worker at a time.
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, (msg) => {
      let secs = msg.content.toString().split('.').length - 1;
      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(() => {
          console.log(" [x] Done");
          channel.ack(msg);
      }, secs * 1000);
    }, {
      // if the consumer went down, it mantains data anyways
      noAck: false
    });

  });
});