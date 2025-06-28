const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL_BASKET_TRAINER;
const SUPABASE_KEY = process.env.SUPABASE_KEY_BASKET_TRAINER;

function createUserClient(accessToken) {
    if (!accessToken) throw new Error("No access token provided");

    return createSupabaseClient(SUPABASE_URL, SUPABASE_KEY, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    });
}

module.exports = { createUserClient };