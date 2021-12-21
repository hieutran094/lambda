import { ApiGatewayRequestContext } from './apiGatewayRequestContext'

export interface ApiGatewayEvent {
  body: string
  resource: string
  path: string
  httpMethod: string
  headers: Record<string, string>
  requestContext: ApiGatewayRequestContext
  pathParameters?: Record<string, string>
}
