"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import AuthCarousel from "./auth-carousel";
import { RegisterOtpVerification } from "./register-otp-verification";
import { ForgotPasswordOtpVerification } from "./reset-otp-verification";
import ForgotPasswordForm from "./forgot-password-form";
import ResetPasswordForm from "./reset-password-form";

export default function AuthLayout() {
  const [activeTab, setActiveTab] = useState("login");
  const [showOtp, setShowOtp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotPasswordOtp, setShowForgotPasswordOtp] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <AuthCarousel />
      <div className="flex justify-center items-center p-8 bg-gradient-to-b from-background to-muted/20">
        <div className="w-full max-w-md">
          {!showForgotPassword &&
            !showForgotPasswordOtp &&
            !showResetPassword && (
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 text-foreground">
                  Welcome to SkillShare
                </h1>
                <p className="text-muted-foreground text-lg">
                  {showOtp
                    ? "Verify your account with OTP"
                    : showForgotPassword
                      ? "Reset your password with OTP"
                      : showResetPassword
                        ? "Reset your password"
                        : activeTab === "login"
                          ? "Sign in to your account"
                          : "Create your account to get started"}
                </p>
              </div>
            )}

          <div className="bg-card rounded-xl shadow-lg border border-border/50 p-8 backdrop-blur-sm">
            {showOtp ? (
              <RegisterOtpVerification
                onOtpExpired={() => setShowOtp(false)}
                email={registeredEmail || ""}
              />
            ) : showForgotPasswordOtp ? (
              <ForgotPasswordOtpVerification
                email={registeredEmail || ""}
                onOtpExpired={() => setShowForgotPasswordOtp(false)}
                onSuccess={() => {
                  setShowForgotPasswordOtp(false);
                  setShowResetPassword(true);
                }}
              />
            ) : showForgotPassword ? (
              <ForgotPasswordForm
                onSuccess={(email: string) => {
                  setShowForgotPassword(false);
                  setRegisteredEmail(email);
                  setShowForgotPasswordOtp(true);
                }}
              />
            ) : showResetPassword ? (
              <ResetPasswordForm
                email={registeredEmail || ""}
                onSuccess={() => setShowResetPassword(false)}
              />
            ) : (
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-6 w-full">
                  <TabsTrigger className="cursor-pointer" value="login">
                    Login
                  </TabsTrigger>
                  <TabsTrigger className="cursor-pointer" value="register">
                    Register
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm
                    setActiveTab={setActiveTab}
                    setForgotpassword={setShowForgotPassword}
                  />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm
                    setActiveTab={setActiveTab}
                    onSuccess={(email: string) => {
                      setRegisteredEmail(email);
                      setShowOtp(true);
                    }}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
