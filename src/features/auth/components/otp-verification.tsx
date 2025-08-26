"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpVerificationProps {
  onVerify: (otp: string) => void;
  onResend: () => void;
  email: string;
  isLoading?: boolean;
}

export default function OtpVerification({
  onVerify,
  onResend,
  email,
  isLoading = false,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpTimer, setOtpTimer] = useState(300);
  const [resendTimer, setResendTimer] = useState(0);
  const [hasResent, setHasResent] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (otpTimer > 0) {
        setOtpTimer((prev) => prev - 1);
      }
      if (resendTimer > 0) {
        setResendTimer((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [otpTimer, resendTimer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    if (otpTimer <= 0) {
      setError("OTP has expired. Please request a new code.");
      return;
    }
    onVerify(otp);
  };

  const handleResend = () => {
    onResend();
    setOtpTimer(300);
    setOtp("");
    setError("");

    if (!hasResent) {
      setHasResent(true);
      setResendTimer(60);
    } else {
      setResendTimer(60);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError("");
  };

  const isComplete = otp.length === 6;
  const isOtpExpired = otpTimer <= 0;
  const canResend = resendTimer <= 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Verify Your Email</h2>
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

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              disabled={isLoading || isOtpExpired}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {isOtpExpired && (
            <p className="text-sm text-red-500 text-center">
              Your verification code has expired. Please request a new one.
            </p>
          )}
        </div>

        <Button
          onClick={handleVerify}
          disabled={!isComplete || isLoading || isOtpExpired}
          className="w-full"
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          <div className="flex flex-col items-center space-y-1">
            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={isLoading || !canResend}
              className="text-sm"
            >
              {canResend ? "Resend Code" : "Resend Code"}
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
    </div>
  );
}
