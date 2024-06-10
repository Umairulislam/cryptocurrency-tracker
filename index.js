import express from "express"
import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

// Setup express app
const app = express()
const PORT = 3000
const API_URL = "https://api.coingecko.com/api/v3"
const API_KEY = process.env.COINGECKO_API_KEY

// Middleware
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")

// Route to display the top 10 cryptocurrencies
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/coins/markets`, {
      params: {
        vs_currency: "usd",
        per_page: 10,
        order: "market_cap_desc",
        sparkline: false,
        price_change_percentage: "24h",
        x_cg_demo_api_key: API_KEY,
      },
    })

    const coins = response.data
    res.render("index", { coins })
  } catch (error) {
    console.error(error)
    res.render("error.ejs", { message: "Failed to fetch data from the server" })
  }
})

// Route to display detailed information about a specific cryptocurrency
app.get("/coin/:id", async (req, res) => {
  const { id } = req.params
  try {
    const response = await axios.get(`${API_URL}/coins/${id}`, {
      params: {
        x_cg_demo_api_key: API_KEY,
      },
    })
    const coin = response.data
    res.render("coin", { coin })
  } catch (error) {
    console.error(error)
    res.render("error.ejs", { message: "Failed to fetch data from the server" })
  }
})

// Route to display historical price data of a specific cryptocurrency
app.get("/history/:id", async (req, res) => {
  const { id } = req.params
  try {
    const response = await axios.get(`${API_URL}/coins/${id}/market_chart`, {
      params: {
        vs_currency: "usd",
        days: 30,
        x_cg_demo_api_key: API_KEY,
      },
    })

    const history = response.data.prices
    res.render("history", { history, coinId: id })
  } catch (error) {
    console.error(error)
    res.render("error.ejs", { message: "Failed to fetch data from the server" })
  }
})

// Route to search for cryptocurrencies
app.get("/search", async (req, res) => {
  const query = req.query.q
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { query, x_cg_demo_api_key: API_KEY },
    })
    const results = response.data.coins
    res.render("search", { results, query })
  } catch (error) {
    console.error(error)
    res.render("error", { message: "Failed to fetch data" })
  }
})

// Listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
