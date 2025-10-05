import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xpaqoturecevoyjjmwez.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwYXFvdHVyZWNldm95amptd2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzOTYzODIsImV4cCI6MjA3Mzk3MjM4Mn0.ohoFcJIiYeeZ3b16o_8U5OeKXgPez3JTMAD7maAtT7c";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
