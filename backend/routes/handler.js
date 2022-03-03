const express = require('express')

const router = express.Router()

router.get("/point", (req, res) => {
    const str = [{
        name: "something",
        msg: "This is something",
        username: "something2"
    }]
    res.end(JSON.stringify(str))
})

router.post('/add', (req, res) => {
    res.end('NA')
})

module.exports = router