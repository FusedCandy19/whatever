import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../store/auth.store";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { ROUTES } from "../../lib/constants";
import { loginSchema } from "../../lib/validators";
import { toast } from "sonner";

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authApi.login(data.email, data.password);
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      navigate(ROUTES.DASHBOARD);
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Sign In</CardTitle>
        <p className="text-center text-muted-foreground text-sm">Enter your credentials to continue</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
          <div className="text-right">
            <Link to={ROUTES.FORGOT} className="text-xs text-brand hover:underline">Forgot password?</Link>
          </div>
          <Button type="submit" className="w-full" loading={loading}>Sign In</Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{" "}
          <Link to={ROUTES.REGISTER} className="text-brand hover:underline">Sign up</Link>
        </p>
      </CardContent>
    </Card>
  );
}
