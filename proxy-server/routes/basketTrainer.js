const express = require("express");
const router = express.Router();
const { register, login, logout, refreshAccessToken, getSession, getStats, postStat } = require("../services/basketTrainer/supabase");
const { createUserClient } = require("../services/basketTrainer/supabaseCreateUserClient")

router.use(express.json());


//AUTH ROUTES
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({
            error: "email is missing"
        })
    }

    if (!password) {
        return res.status(400).json({
            error: "password is missing"
        })
    }

    try {
        const { user, session } = await register(email, password)

        return res.status(200).json({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            user: user
        })


    } catch (error) {
        return res.status(500).json({
            error: error.message ||
                'Internal Server Error'
        })
    }
})


router.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(400).json({
            error: "email is missing"
        })
    }

    if (!password) {
        return res.status(400).json({
            error: "email is missing"
        })
    }

    try {
        const { user, session } = await login(email, password)

        return res.status(200).json({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            user: user
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message ||
                'Internal Server Error'
        })
    }
})

router.post("/logout", async (req, res) => {
    const { refresh_token } = req.body

    if (!refresh_token) {
        return res.status(400).json({
            error: "refresh_token is missing",
        })
    }

    try {

        await logout(refresh_token)

        return res.status(200).json({
            response: "logout success"
        })

    } catch (error) {

        return res.status(500).json({
            error: error.message ||
                'Internal Server Error'
        })

    }

})

router.post("/refresh", async (req, res) => {
    const { refresh_token } = req.body

    if (!refresh_token) {
        return res.status(400).json({
            error: "refresh token missing"
        })
    }

    try {
        const { user, session } = await refreshAccessToken(refresh_token)

        return res.status(200).json({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            user: user
        })

    } catch (error) {

        return res.status(500).json({
            error: error.message ||
                'Internal Server Error'
        })
    }

})

router.get("/getSession", async (req, res) => {
    try {
        const session = await getSession()

        return res.status(200).json({
            session: session
        })
    } catch (error) {

        return res.status(500).json({
            error: error.message ||
                'Internal Server Error'
        })
    }
})



//DATABASE ROUTES
router.post("/postStat", async (req, res) => {
    const { stat } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(400).json({
            error: "Authorization token missing"
        })
    }

    if (!stat) {
        return res.status(400).json({
            error: "stat is missing"
        })
    }

    const token = authHeader.split(" ")[1];

    const userClient = createUserClient(token)



    try {
        const data = await postStat(stat, userClient)

        return res.status(200).json({
            data: data
        })

    } catch (error) {

        return res.status(500).json({
            error: error.message ||
                'Internal Server Error'
        })
    }
})



router.post("/getStats", async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            error: "user ID missing"
        })
    }

    try {
        const data = await getStats(userId)

        return res.status(200).json({
            statsData: data
        })

    } catch (error) {

        return res.status(500).json({
            error: error.message ||
                'Internal Server Error'
        })
    }
})

module.exports = router;