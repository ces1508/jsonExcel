'use strict'
const r = require('rethinkdb')
const co = require('co')
const uuid = require('uuid-base62')
const json2xls = require('json2xls')
let  actions =  {
  createExcel (id) {
    let task = co.wrap(function * () {
      let conn = yield r.connect({
        host: 'localhost',
        port: 28015
      })
      let data = yield r.db('mepscloud').table('historicSms').getAll(id, {index: 'campaingId'})
        .without('userId','campaingId','id').run(conn)
      let results = null
      try {
        results = yield data.toArray()

        let xls =  json2xls(results, {})
        fs.writeFileSync(`${uuid.v4()}-campaña-comfamiliar.xlsx`, xls, 'binary');
        return Promise.resolve('file ready')
      } catch (e) {
        return Promise.reject(e.message)
      }
    })
    return Promise.resolve(task())
 }
}
module.exports = actions