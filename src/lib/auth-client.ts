import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  plugins: [adminClient()],
  baseURL: process.env.BETTER_AUTH_URL,
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  sendVerificationEmail,
  revokeOtherSessions,
  revokeSession,
  forgetPassword,
  changePassword,
  resetPassword,
  updateUser,
  changeEmail,
  deleteUser,
  getSession,
  admin,
} = authClient;
