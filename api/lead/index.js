const { TableClient } = require('@azure/data-tables')

// THE TRIALS lead vault — every registered player lands in Azure Table
// Storage (table: leads). Review with:
//   az storage entity query --table-name leads --connection-string "$LEADS_CONNECTION"
module.exports = async function (context, req) {
  try {
    const conn = process.env.LEADS_CONNECTION
    if (!conn) {
      context.res = { status: 500, body: { ok: false, error: 'storage not configured' } }
      return
    }
    const b = req.body || {}
    const name = String(b.name || '').slice(0, 120).trim()
    const email = String(b.email || '').slice(0, 160).trim()
    if (!name || !email) {
      context.res = { status: 400, body: { ok: false, error: 'name and email required' } }
      return
    }
    const client = TableClient.fromConnectionString(conn, 'leads')
    await client.createTable().catch(() => {})
    await client.createEntity({
      partitionKey: 'trials',
      rowKey: `${new Date().toISOString()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      email,
      phone: String(b.phone || '').slice(0, 40).trim(),
      stage: String(b.stage || 'register').slice(0, 32),
      stats: JSON.stringify(b.stats || {}).slice(0, 2000),
      userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
    })
    context.res = { status: 200, body: { ok: true } }
  } catch (e) {
    context.log.error('lead write failed:', e.message)
    context.res = { status: 500, body: { ok: false } }
  }
}
