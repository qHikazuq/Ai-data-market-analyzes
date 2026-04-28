import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  // Verify the user is admin
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: "Unauthorized" });
  if (user.email !== "leonardogiardin0@gmail.com") return res.status(403).json({ error: "Forbidden" });

  // Fetch all users with service role
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error: listError } = await adminSupabase.auth.admin.listUsers();
  if (listError) return res.status(500).json({ error: listError.message });

  return res.status(200).json({ users: data.users });
}
