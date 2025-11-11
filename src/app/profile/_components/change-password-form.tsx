/* eslint-disable @next/next/no-img-element */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Field, FieldGroup, FieldSet } from "@/components/ui/field";

import { FormCheckbox, FormPasswordInput } from "@/components/form/form-base";

import { z } from "zod/v4";
import { toast } from "sonner";

import { LoadingSwap } from "@/components/shared/loading-swap";
import { changePassword } from "@/lib/auth-client";

const passwordSchema = z
  .string()
  .min(1, { message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[^A-Za-z0-9]/, {
    message:
      "Password must contain at least one special character i.e. not a number or letter",
  });

const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  revokeOtherSessions: z.boolean(),
});

type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      revokeOtherSessions: true,
    },
  });

  const { isSubmitting } = form.formState;

  async function handlePasswordChange(values: ChangePasswordFormType) {
    await changePassword(values, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to change password");
      },
      onSuccess: () => {
        toast.success("Password changed successfully");
        form.reset();
      },
    });
  }

  return (
    <Card className="flex w-[300px] overflow-hidden p-6 md:w-[465px]">
      <CardHeader className="text-center">
        <CardTitle className="text-primary">Reset Password?</CardTitle>
        <CardDescription>
          Please enter your current and new passwords. A link will be sent to
          reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex w-full p-6">
        <form
          id="reset-password-form"
          onSubmit={form.handleSubmit(handlePasswordChange)}
        >
          <FieldGroup className="w-[200px] md:min-w-[348px]">
            <FormPasswordInput
              control={form.control}
              name="currentPassword"
              label="Current Password"
            />
            <FormPasswordInput
              control={form.control}
              name="newPassword"
              label="New Password"
            />

            <div>
              <h3 className="text-xs text-blue-500">
                Minimum 8 characters including at least one special character.
              </h3>
            </div>
          </FieldGroup>
          <div className="mt-4">
            <FieldSet>
              <FieldGroup data-slot="checkbox-group">
                <FormCheckbox
                  name="revokeOtherSessions"
                  control={form.control}
                  label="Log out other sessions"
                />
              </FieldGroup>
            </FieldSet>
          </div>
        </form>
      </CardContent>
      <CardFooter className="max-w-40 md:max-w-[310px]">
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="reset-password-form"
            className="w-full cursor-pointer dark:bg-blue-600 dark:text-white"
            disabled={isSubmitting}
          >
            <LoadingSwap isLoading={isSubmitting}>Submit</LoadingSwap>
          </Button>
          <Button
            className="border-red-500"
            type="button"
            form="reset-password-form"
            variant="outline"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
