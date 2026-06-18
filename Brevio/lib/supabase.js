import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://arjjfcggyftgogpovqks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyampmY2dneWZ0Z29ncG92cWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjg4MzUsImV4cCI6MjA5MjgwNDgzNX0.AFIAtGSUzS-P4HJAMS-6Gab5rMh4NUtC82VYRipzMnE"
);
