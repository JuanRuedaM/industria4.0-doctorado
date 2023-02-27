import amqp from 'amqplib/callback_api.js';

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
      throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
        throw error1;
    }
    var exchange = 'logs';

    channel.assertExchange(exchange, 'fanout', {
        durable: false
    });

    channel.assertQueue('', {
      //When the connection that declared it closes, the queue will be deleted because it is declared as exclusive
      exclusive: true
    }, (error2, q) => {
      if (error2) {
          throw error2;
      }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      channel.bindQueue(q.queue, exchange, '');

      channel.consume(q.queue, (msg) => {
          if (msg.content) {
              console.log(" [x] %s", msg.content.toString());
          }
      }, {
          noAck: true
      });
    });
  });
});