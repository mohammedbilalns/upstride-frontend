import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

interface OtpInputFieldProps {
	otp: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	error?: string;
	isExpired?: boolean;
}

export function OtpInputField({
	otp,
	onChange,
	disabled,
	error,
	isExpired,
}: OtpInputFieldProps) {
	// Create a static array of unique identifiers
	const otpSlots = ["slot-1", "slot-2", "slot-3", "slot-4", "slot-5", "slot-6"];

	return (
		<div className="space-y-2">
			<Label className="justify-center" htmlFor="otp">
				Verification Code
			</Label>
			<div className="flex justify-center">
				<InputOTP
					maxLength={6}
					value={otp}
					onChange={onChange}
					disabled={disabled || isExpired}
				>
					<InputOTPGroup>
						{otpSlots.map((id, index) => (
							<InputOTPSlot key={id} index={index} />
						))}
					</InputOTPGroup>
				</InputOTP>
			</div>
			{error && <p className="text-sm text-red-500 text-center">{error}</p>}
			{isExpired && (
				<p className="text-sm text-red-500 text-center">
					Your verification code has expired. Please request a new one.
				</p>
			)}
		</div>
	);
}
