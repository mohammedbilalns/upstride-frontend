import { useResendRegisterOtp, useVerifyRegisterOtp } from "../hooks";
import { OtpVerificationBase } from "./OtpVerification";

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
