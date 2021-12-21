import { ApiGatewayEvent } from '../common/apiGateway/apiGatewayEvent'
import { ApiGatewayResponse } from '../common/apiGateway/apiGatewayResponse'

export interface LambdaApp {
  run(event: ApiGatewayEvent): Promise<ApiGatewayResponse>
}
