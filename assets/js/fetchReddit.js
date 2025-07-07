import axios from 'axios'
import qs    from 'qs'

// env vars: CLIENT_ID, CLIENT_SECRET, REDDIT_REFRESH_TOKEN, SUBREDDIT
async function getRedditToken() {
  const resp = await axios.post(
    'https://www.reddit.com/api/v1/access_token',
    qs.stringify({
      grant_type:    'refresh_token',
      refresh_token: process.env.REDDIT_REFRESH_TOKEN
    }),
    {
      auth: {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  )
  return resp.data.access_token
}

async function fetchReddit() {
  const token = await getRedditToken()
  const resp  = await axios.get(
    `https://oauth.reddit.com/r/${process.env.SUBREDDIT}/hot?limit=5`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent':  'ASI-Saga-Bot/1.0'
      }
    }
  )
  console.log(JSON.stringify(resp.data, null, 2))
}

fetchReddit().catch(err => {
  console.error(err.toString())
  process.exit(1)
})
