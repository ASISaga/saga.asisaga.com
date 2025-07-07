import axios from 'axios'

const token = process.env.ACCESS_TOKEN
const sub = process.env.SUBREDDIT

async function fetchReddit() {
  const resp = await axios.get(
    `https://oauth.reddit.com/r/${sub}/hot?limit=5`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'ASI-Saga-Bot/1.0'
      }
    }
  )
  console.log(JSON.stringify(resp.data, null, 2))
}

fetchReddit().catch(err => {
  console.error(err.toString())
  process.exit(1)
})
