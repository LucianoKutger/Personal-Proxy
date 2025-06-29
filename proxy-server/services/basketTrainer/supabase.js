const { createClient } = require('@supabase/supabase-js')
require("dotenv").config();

const SUPABASE_KEY = process.env.SUPABASE_KEY_BASKET_TRAINER
const SUPABASE_URL = process.env.SUPABASE_URL_BASKET_TRAINER

if (!SUPABASE_KEY || !SUPABASE_URL) {
    throw new Error('No SUPABASE_KEY or SUPABASE_URL found')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

//AUTH FUNCTIONS

async function login(email, password) {
    try {

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) throw error

        return data

    } catch (error) {
        throw error
    }
}

async function register(email, password, displayName) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: displayName
                }
            }
        })

        if (error) throw error

        return data

    } catch (error) {

        throw error
    }
}

async function logout(refresh_token) {
    try {
        const { error } = await supabase.auth.signOut({ refresh_token })

        if (error) throw error

    } catch (error) {
        throw error
    }
}

async function refreshAccessToken(refresh_token) {
    try {

        const { data, error } = await supabase.auth.refreshSession({ refresh_token })

        if (error) throw error

        return data

    } catch (error) {
        throw error
    }
}

async function getSession() {
    try {

        const { data, error } = await supabase.auth.getSession()

        if (error) throw error

        return data.session

    } catch (error) {

        throw error
    }
}

//DATABASE FUNCTIONS

async function getStats(userId, userClient) {
    try {
        const { data, error } = await userClient
            .from('stats')
            .select()
            .eq('userId', userId)

        if (error) throw error

        return data

    } catch (error) {
        throw error
    }
}

async function getStatById(statId, userId, userClient) {
    try {
        const { data, error } = await userClient
            .from('stats')
            .select()
            .eq("userId", userId)
            .eq("id", statId)

        if (error) throw error

        return data

    } catch (error) {

        throw error

    }
}

async function postStat(stat, userClient) {

    try {

        const { data, error } = await userClient
            .from('stats')
            .insert([stat])
            .select()


        if (error) throw error

        return data

    } catch (error) {

        throw error
    }
}

async function deleteStat(statId, userClient) {
    try {

        const response = await userClient
            .from('stats')
            .delete()
            .eq('id', statId)

        return response

    } catch (error) {

        throw error
    }
}

//USER CLIENT
function createUserClient(access_token) {
    return createClient(SUPABASE_URL, SUPABASE_KEY, {
        global: {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        },
    });
}


module.exports = { register, logout, login, refreshAccessToken, getStatById, getStats, deleteStat, postStat, getSession, createUserClient }