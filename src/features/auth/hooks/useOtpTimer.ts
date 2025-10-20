import { useEffect, useState } from "react";

export function useOtpTimer(initialOtpTime = 300, initialResendCooldown = 60) {
	const [otpTimer, setOtpTimer] = useState(initialOtpTime);
	const [resendTimer, setResendTimer] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			if (otpTimer > 0) setOtpTimer((prev) => prev - 1);
			if (resendTimer > 0) setResendTimer((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [otpTimer, resendTimer]);

	const resetOtpTimer = () => setOtpTimer(initialOtpTime);
	const startResendCooldown = () => setResendTimer(initialResendCooldown);

	return {
		otpTimer,
		resendTimer,
		resetOtpTimer,
		startResendCooldown,
		isOtpExpired: otpTimer <= 0,
		canResend: resendTimer <= 0,
	};
}
