import { useResendForgotOtp } from "../-hooks/useResendForgotOtp";
import { useVerifyForgotOtp } from "../-hooks/useVerifyForgotPassworOtp";
import { OtpVerificationBase } from "./otp-verification-base";

export function ForgotPasswordOtpVerification({
	email,
	onOtpExpired,
	onSuccess,
}: {
	email: string;
	onOtpExpired: () => void;
	onSuccess: () => void;
}) {
	const verifyOtpMutation = useVerifyForgotOtp({ onOtpExpired, onSuccess });
	const resendOtpMutation = useResendForgotOtp({ onOtpExpired });
	return (
		<OtpVerificationBase
			email={email}
			title="Reset Your Password"
			verifyMutation={verifyOtpMutation}
			resendMutation={resendOtpMutation}
		/>
	);
}
