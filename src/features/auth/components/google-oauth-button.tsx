import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { useGoogleLogin } from "../hooks/useGoogleLogin";

export default function GoogleOAuthButton() {
  const googleAuthMutation = useGoogleLogin();
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      googleAuthMutation.mutate(credentialResponse);
    }
  };

  return <GoogleLogin auto_select onSuccess={handleSuccess}></GoogleLogin>;
}
