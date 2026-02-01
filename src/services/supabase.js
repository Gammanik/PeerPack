import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are configured
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file');
}

// Create Supabase client (will be null if credentials not set)
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false
        }
    })
    : null;

// Helper function to get or create user from Telegram data
export const getOrCreateUser = async (telegramUser) => {
    try {
        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', telegramUser.id)
            .single();

        if (existingUser) {
            return { user: existingUser, error: null };
        }

        // Create new user if not exists
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
                telegram_id: telegramUser.id,
                telegram_username: telegramUser.username,
                first_name: telegramUser.first_name,
                last_name: telegramUser.last_name,
                avatar_url: telegramUser.photo_url
            })
            .select()
            .single();

        if (createError) {
            return { user: null, error: createError };
        }

        return { user: newUser, error: null };
    } catch (error) {
        console.error('Error in getOrCreateUser:', error);
        return { user: null, error };
    }
};

export default supabase;
