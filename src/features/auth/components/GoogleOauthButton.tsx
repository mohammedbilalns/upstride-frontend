import type { CredentialResponse } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "../hooks";

export default function GoogleOAuthButton({
	onRegisterSuccess,
}: {
	onRegisterSuccess?: (email: string) => void;
}) {
	const googleAuthMutation = useGoogleLogin({ onRegisterSuccess });
	const handleSuccess = (credentialResponse: CredentialResponse) => {
		if (credentialResponse.credential) {
			googleAuthMutation.mutate(credentialResponse);
		}
	};

	return <GoogleLogin auto_select onSuccess={handleSuccess}></GoogleLogin>;
}
