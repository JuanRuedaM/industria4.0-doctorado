import amqp from 'amqplib/callback_api.js'
import xl from "excel4node"

let wb = new xl.Workbook();
let ws = wb.addWorksheet('Sheet 1');
let style = wb.createStyle({
  alignment: {
    horizontal: ['center']
  },
  font: {
    color: '#0000ff',
    size: 12,
    outline: true,
  }
  // numberFormat: '$#,##0.00; ($#,##0.00); -',
});

ws.cell(1, 1)
  .string('Value sensor')
  .style(style);

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    // Queue declaration. we want to make sure the queue exists before we try to consume messages from it.
    let queue = 'hello';

    channel.assertQueue(queue, {
      durable: false
    });
    
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    let cont = 2
    channel.consume(queue, (msg) => {
      let mensaje = msg.content.toString()
      console.log(" [x] Received %s", mensaje);
      ws.cell(cont, 1).string(mensaje) 
      wb.write('Excel.xlsx');
      cont++
    }, {
      noAck: true
    });
  });
});


