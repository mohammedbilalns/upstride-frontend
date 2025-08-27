"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import AuthCarousel from "./auth-carousel";
import OtpVerification from "./otp-verification";

export default function AuthLayout() {
  const [activeTab, setActiveTab] = useState("login");
  const [showOtp, setShowOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <AuthCarousel />
      <div className="flex justify-center items-center p-8 bg-gradient-to-b from-background to-muted/20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Welcome to SkillShare
            </h1>
            <p className="text-muted-foreground text-lg">
              {showOtp
                ? "Verify your account with OTP"
                : activeTab === "login"
                  ? "Sign in to your account"
                  : "Create your account to get started"}{" "}
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-lg border border-border/50 p-8 backdrop-blur-sm">
            {showOtp ? (
              <OtpVerification
                email={registeredEmail || ""}
                onVerify={() => console.log("verified")}
                onResend={() => console.log("resending otp")}
                isLoading={false}
              />
            ) : (
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-6 w-full">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm setActiveTab={setActiveTab} />
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
