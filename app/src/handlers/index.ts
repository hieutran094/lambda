import { ApiGatewayEvent } from '../common/apiGateway/apiGatewayEvent'
import { ApiGatewayResponse } from '../common/apiGateway/apiGatewayResponse'
import { createConnection } from 'typeorm'
import { TypeOrmConfig } from '../database/ormconfig'
import { FeedApp } from '../apps/feedApp'
import { LambdaApp } from '../apps/lambdaApp'

export const handler = async (event: ApiGatewayEvent): Promise<ApiGatewayResponse> => {
  let conn
  try {
    if (!conn) conn = await createConnection(TypeOrmConfig)
    const app: LambdaApp = new FeedApp(conn)
    console.log('Running the GetFeel')
    return await app.run(event)
  } catch (err) {
    console.log(err.message)
    return { statusCode: 500, body: JSON.stringify(err) }
  } finally {
    if (conn) await conn.close()
  }
}
