import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../api/auth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { ROUTES } from "../../lib/constants";
import { toast } from "sonner";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success("Reset email sent if account exists");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
        <p className="text-center text-muted-foreground text-sm">We'll send you a reset link</p>
      </CardHeader>
      <CardContent>
        {sent ? (
          <p className="text-center text-sm text-muted-foreground">Check your email for a password reset link.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" className="w-full" loading={loading}>Send Reset Link</Button>
          </form>
        )}
        <p className="text-center text-sm text-muted-foreground mt-4">
          <Link to={ROUTES.LOGIN} className="text-brand hover:underline">Back to sign in</Link>
        </p>
      </CardContent>
    </Card>
  );
}
