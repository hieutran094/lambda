import axios, { AxiosInstance } from 'axios'

export class PanelService {
  private axios: AxiosInstance
  constructor() {
    this.axios = axios.create({
      baseURL: process.env.PANEL_DOMAIN,
      headers: {
        toremassekey: process.env.TOREMASSE_HEADER,
        Accept: 'application/json',
      },
    })
  }

  async getSiteInfo(domain) {
    try {
      const res = await this.axios.get('/v1/sites/' + domain)
      return res.data.data
    } catch (err) {
      console.error(err)
      return
    }
  }
}
