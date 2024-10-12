import amqplib from 'amqplib'

export const publishEvent = async (eventType: string, data: any) => {
  const connection = await amqplib.connect(process.env.RABBITMQ_URL!)
  const channel = await connection.createChannel()

  const exchange = 'user_events'
  await channel.assertExchange(exchange, 'fanout', { durable: true })

  channel.publish(exchange, '', Buffer.from(JSON.stringify({ eventType, data })))

  setTimeout(() => {
    connection.close()
  }, 500)
}
