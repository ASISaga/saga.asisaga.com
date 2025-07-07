import axios from 'axios'

// env vars: CLIENT_ID, CLIENT_SECRET, LINKEDIN_REFRESH_TOKEN
async function getAccessToken() {
  const resp = await axios.post(
    'https://www.linkedin.com/oauth/v2/accessToken',
    null,
    { params: {
      grant_type:    'refresh_token',
      refresh_token: process.env.LINKEDIN_REFRESH_TOKEN,
      client_id:     process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    }}
  )
  return resp.data.access_token
}

async function fetchLinkedIn() {
  const token = await getAccessToken()
  const resp  = await axios.get(
    'https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(...)',
    { headers: { Authorization: `Bearer ${token}` } }
  )
  console.log(JSON.stringify(resp.data, null, 2))
}

fetchLinkedIn().catch(err => {
  console.error(err.toString())
  process.exit(1)
})
