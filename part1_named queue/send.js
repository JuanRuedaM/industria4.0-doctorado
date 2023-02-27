import amqp from 'amqplib/callback_api.js';

// Connect to server
amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  // Creates a channel
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    // Decalre queue and send message
    let queue = 'hello';
    let msg = '';

    channel.assertQueue(queue, {
      durable: false
    });

      let interval = setInterval(() => {
        msg = [Math.floor(Math.random() * 20) + 540].toString()
        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
      }, 1000)

      setTimeout(() => {
        clearInterval(interval)
        connection.close(); 
        process.exit(0) 
      }, 11000);

  });

  // Close communication and exit
  /* setTimeout(() => {
    connection.close(); 
    process.exit(0)
  }, 500); */
});

