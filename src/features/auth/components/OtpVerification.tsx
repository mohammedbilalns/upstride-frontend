import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOtpTimer } from "../hooks";
import { OtpInputField } from "./OtpInputField";

interface OtpVerificationBaseProps {
	email: string;
	title?: string;
	verifyMutation: {
		mutate: (data: { email: string; otp: string }) => void;
		isPending: boolean;
	};
	resendMutation: {
		mutate: (data: { email: string }) => void;
		isPending: boolean;
	};
}

export function OtpVerificationBase({
	email,
	title = "Verify Your Email",
	verifyMutation,
	resendMutation,
}: OtpVerificationBaseProps) {
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");

	const {
		otpTimer,
		resendTimer,
		resetOtpTimer,
		startResendCooldown,
		isOtpExpired,
		canResend,
	} = useOtpTimer();

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

	const handleVerify = () => {
		if (otp.length !== 6) return setError("Please enter the full 6-digit code");
		verifyMutation.mutate({ email, otp });
	};

	const handleResend = () => {
		resendMutation.mutate({ email });
		resetOtpTimer();
		setOtp("");
		setError("");
		startResendCooldown();
	};

	return (
		<div className="space-y-6">
			<div className="text-center space-y-2">
				<h2 className="text-2xl font-semibold">{title}</h2>
				<p className="text-muted-foreground">
					We've sent a 6-digit verification code to{" "}
					<span className="font-medium text-foreground">{email}</span>
				</p>
				<p className="text-sm text-muted-foreground">
					Code expires in:{" "}
					<span
						className={`font-medium ${otpTimer <= 60 ? "text-red-500" : "text-foreground"}`}
					>
						{formatTime(otpTimer)}
					</span>
				</p>
			</div>

			<OtpInputField
				otp={otp}
				onChange={(v) => {
					setOtp(v);
					setError("");
				}}
				disabled={verifyMutation.isPending}
				error={error}
				isExpired={isOtpExpired}
			/>

			<Button
				onClick={handleVerify}
				disabled={otp.length !== 6 || isOtpExpired}
				className="w-full cursor-pointer"
			>
				{verifyMutation.isPending ? "Verifying..." : "Verify Code"}
			</Button>

			<div className="text-center space-y-2">
				<p className="text-sm text-muted-foreground">
					Didn't receive the code?
				</p>
				<div className="flex flex-col items-center space-y-1">
					<Button
						variant="ghost"
						onClick={handleResend}
						disabled={resendMutation.isPending || !canResend}
						className="text-sm"
					>
						Resend Code
					</Button>
					{!canResend && (
						<p className="text-xs text-muted-foreground">
							Resend available in:{" "}
							<span className="font-medium text-foreground">
								{formatTime(resendTimer)}
							</span>
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
