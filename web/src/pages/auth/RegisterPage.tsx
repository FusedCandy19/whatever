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
import { registerSchema } from "../../lib/validators";
import { toast } from "sonner";

type FormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authApi.register(data.name, data.email, data.password);
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      navigate(ROUTES.DASHBOARD);
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Create Account</CardTitle>
        <p className="text-center text-muted-foreground text-sm">Get started with your API access</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name" placeholder="Your name" error={errors.name?.message} {...register("name")} />
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" placeholder="Min 8 characters" error={errors.password?.message} {...register("password")} />
          <Button type="submit" className="w-full" loading={loading}>Create Account</Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} className="text-brand hover:underline">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  );
}
