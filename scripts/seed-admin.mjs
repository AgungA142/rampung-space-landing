import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const rl = createInterface({ input: stdin, output: stdout });

const email = (await rl.question("Admin email: ")).trim().toLowerCase();
const fullName = (await rl.question("Full name: ")).trim();
const password = (await rl.question("Password: ")).trim();
const role = (await rl.question("Role (admin/super_admin) [admin]: ")).trim() || "admin";

rl.close();

if (!email || !fullName || !password) {
  console.error("Email, full name, and password are all required.");
  process.exit(1);
}

if (role !== "admin" && role !== "super_admin") {
  console.error("Role must be 'admin' or 'super_admin'.");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);
const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { error } = await supabase
  .from("admin_users")
  .upsert(
    { email, full_name: fullName, password_hash: passwordHash, role },
    { onConflict: "email" }
  );

if (error) {
  console.error("Failed to create/update admin:", error.message);
  process.exit(1);
}

console.log(`Admin account ready: ${email} (${role})`);
