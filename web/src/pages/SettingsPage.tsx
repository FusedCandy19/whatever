import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { settingsApi } from "../api/settings";
import { useAuthStore } from "../store/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { profileSchema, changePasswordSchema } from "../lib/validators";
import { toast } from "sonner";

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof changePasswordSchema>;

export default function SettingsPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const { accessToken, refreshToken } = useAuthStore();

  const { data: profile } = useQuery({ queryKey: ["settings"], queryFn: () => settingsApi.get().then((r) => r.data) });

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    values: { name: profile?.name ?? "", email: profile?.email ?? "" },
  });

  const pwForm = useForm<PasswordData>({ resolver: zodResolver(changePasswordSchema) });

  const profileMut = useMutation({
    mutationFn: (d: ProfileData) => settingsApi.updateProfile(d).then((r) => r.data),
    onSuccess: (user) => {
      setAuth(user, accessToken!, refreshToken!);
      toast.success("Profile updated");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const pwMut = useMutation({
    mutationFn: (d: PasswordData) => settingsApi.changePassword(d.current, d.next),
    onSuccess: () => { pwForm.reset(); toast.success("Password changed"); },
    onError: () => toast.error("Failed to change password"),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit((d) => profileMut.mutate(d))} className="space-y-4">
            <Input label="Name" error={profileForm.formState.errors.name?.message} {...profileForm.register("name")} />
            <Input label="Email" type="email" error={profileForm.formState.errors.email?.message} {...profileForm.register("email")} />
            <Button type="submit" loading={profileMut.isPending}>Save Changes</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={pwForm.handleSubmit((d) => pwMut.mutate(d))} className="space-y-4">
            <Input label="Current Password" type="password" error={pwForm.formState.errors.current?.message} {...pwForm.register("current")} />
            <Input label="New Password" type="password" error={pwForm.formState.errors.next?.message} {...pwForm.register("next")} />
            <Input label="Confirm Password" type="password" error={pwForm.formState.errors.confirm?.message} {...pwForm.register("confirm")} />
            <Button type="submit" loading={pwMut.isPending}>Change Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
