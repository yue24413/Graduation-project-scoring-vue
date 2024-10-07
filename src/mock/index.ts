/*
import * as consty from '@/services/Const'
import type { ResultVO } from '@/type/index'
import { createServer, Response } from 'miragejs'
const server = createServer({})
server.namespace = 'api'

server.post('login', (_schema, request) => {
  const { account, password } = JSON.parse(request.requestBody)

  const resultVO: ResultVO<{}> = { code: 200, data: {} }
  if (account == '123456' && password == '123456') {
    return new Response(
      200,
      {
        name: 'SUN',
        role: consty.USER,
        token:
          '744193c872b677aab12a0ced447882f4cf9fca92a09d428a26ed145ed2ed2eec665c8824ebc353042ba2be136efcb5c6'
      },
      resultVO
    )
  }
  if (account == '654321' && password == '654321') {
    return new Response(
      200,
      {
        name: 'ADMIN',
        role: consty.ADMIN,
        token:
          '744193c872b677aab12a0ced447882f4cf9fca92a09d428a26ed145ed2ed2eec665c8824ebc353042ba2be146efcb5c6'
      },
      resultVO
    )
  }
  resultVO.code = 401
  resultVO.message = '用户名密码错误'
  return resultVO
})
*/

// server.get('library', (_schema, request) => {
//   const resultVO: ResultVO<{}> = { code: 200, data: {} }
//   const token = request.requestHeaders.token
//   if (!token) {
//     resultVO.code = 200
//     resultVO.data = { user: { id: 100, name: 'defult' } }
//     return resultVO
//   } else if (
//     token ==
//     '744193c872b677aab12a0ced447882f4cf9fca92a09d428a26ed145ed2ed2eec665c8824ebc353042ba2be136efcb5c6'
//   ) {
//     resultVO.code = 200
//     resultVO.data = { user: { id: 2, name: 'SUN', role: 'As2F' } }
//     return resultVO
//   } else if (
//     token ==
//     '744193c872b677aab12a0ced447882f4cf9fca92a09d428a26ed145ed2ed2eec665c8824ebc353042ba2be146efcb5c6'
//   ) {
//     resultVO.code = 200
//     resultVO.data = { user: { id: 3, name: 'ADMIN', role: 'Pgku' } }
//     return resultVO
//   }

//   resultVO.code = 403
//   resultVO.message = '无权限'
//   return resultVO
// })
