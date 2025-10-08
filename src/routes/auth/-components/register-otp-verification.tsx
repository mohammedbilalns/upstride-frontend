import { useResendRegisterOtp } from "../-hooks/useResendRegisterOtp";
import { useVerifyRegisterOtp } from "../-hooks/useVerifyRegisterOtp";
import { OtpVerificationBase } from "./otp-verification-base";

export function RegisterOtpVerification({
	email,
	onOtpExpired,
	onOtpVerified,
}: {
	email: string;
	onOtpExpired: () => void;
	onOtpVerified: () => void;
}) {
	const verifyOtpMutation = useVerifyRegisterOtp({
		onOtpExpired,
		onOtpVerified,
	});
	const resendOtpMutation = useResendRegisterOtp({ onOtpExpired });

	return (
		<OtpVerificationBase
			email={email}
			title="Verify Your Account"
			verifyMutation={verifyOtpMutation}
			resendMutation={resendOtpMutation}
		/>
	);
}
