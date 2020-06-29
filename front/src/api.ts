import axios from 'axios'

export default {
  getMainPy: async () => {
    const res = await axios({ url: '/api/main.py', method: 'get' })
    return res.data
  },
  postMainPy: async (body: string) => {
    await axios({ url: '/api/main.py', method: 'post', data: { body } })
  },
  getRequitementsTxt: async () => {
    const res = await axios({ url: '/api/requirements.txt', method: 'get' })
    return res.data
  },
  postRequirementsTxt: async (body: string) => {
    await axios({ url: '/api/requirements.txt', method: 'post', data: { body } })
  },
  run: async () => {
    const res = await axios({ url: '/api/run' })
    return res.data
  }
}
