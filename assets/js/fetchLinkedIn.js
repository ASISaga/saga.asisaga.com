import axios from 'axios'

const token = process.env.ACCESS_TOKEN
const url = 'https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(...)'

async function fetchLinkedIn() {
  const resp = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
  console.log(JSON.stringify(resp.data, null, 2))
}

fetchLinkedIn().catch(err => {
  console.error(err.toString())
  process.exit(1)
})
