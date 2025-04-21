import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader, Mail, Phone } from "lucide-react";
import { useSupabaseSession } from "@/utils/supabaseAuth";

type AuthMode = "login" | "signup";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"email"|"google"|"phone">("google");
  const [error, setError] = useState("");
  const { session, profile, loading: loadingProfile } = useSupabaseSession();

  // If logged in, redirect to dashboard based on role
  if (session && !loadingProfile) {
    let path = "/citizen-dashboard";
    if (profile?.role === "admin") path = "/admin-dashboard";
    if (profile?.role === "staff") path = "/staff-dashboard";
    navigate(path, { replace: true });
    return null;
  }

  async function signInWithGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) setError(error.message);
    setLoading(false);
  }

  async function signInWithOTP() {
    setLoading(true);
    setError("");
    if (!otp) {
      // Request OTP
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) setError(error.message);
      else setError("OTP sent to your phone.");
    } else {
      // Verify OTP
      const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
      if (error) setError(error.message);
    }
    setLoading(false);
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setError("Check your email for a confirmation link.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to Samasya Seva</CardTitle>
          <CardDescription>
            Welcome! Please sign in to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-center space-x-2">
            <Button variant={tab === "google" ? "default" : "outline"} onClick={() => setTab("google")}>
              Google
            </Button>
            <Button variant={tab === "phone" ? "default" : "outline"} onClick={() => setTab("phone")}>
              <Phone className="mr-2 h-4 w-4" /> Phone
            </Button>
            <Button variant={tab === "email" ? "default" : "outline"} onClick={() => setTab("email")}>
              <Mail className="mr-2 h-4 w-4" /> Email
            </Button>
          </div>
          {tab === "google" && (
            <Button className="w-full mb-4" onClick={signInWithGoogle} disabled={loading}>
              {loading ? <Loader className="animate-spin h-4 w-4" /> : "Continue with Google"}
            </Button>
          )}
          {tab === "phone" && (
            <form
              onSubmit={(e) => { e.preventDefault(); signInWithOTP(); }}
              className="space-y-2 mb-4"
            >
              <Label>Phone Number</Label>
              <Input type="tel" placeholder="+91..." value={phone} onChange={(e) => setPhone(e.target.value)} />
              {otp && (
                <>
                  <Label>Enter OTP</Label>
                  <Input value={otp} onChange={(e) => setOtp(e.target.value)} />
                </>
              )}
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? <Loader className="animate-spin h-4 w-4" /> : "Continue"}
              </Button>
            </form>
          )}
          {tab === "email" && (
            <form onSubmit={handleEmailAuth} className="space-y-2 mb-4">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email" />
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? <Loader className="animate-spin h-4 w-4" /> : mode === "login" ? "Login" : "Sign Up"}
              </Button>
              <div className="text-xs text-center text-muted-foreground mt-2">
                {mode === "login" ? (
                  <>No account? <button className="text-blue-600 underline" type="button" onClick={()=>setMode("signup")}>Sign Up</button></>
                ) : (
                  <>Already have an account? <button className="text-blue-600 underline" type="button" onClick={()=>setMode("login")}>Login</button></>
                )}
              </div>
            </form>
          )}
          {error && (
            <div className="bg-red-100 text-red-600 rounded p-2 text-sm">{error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
