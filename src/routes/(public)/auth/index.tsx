import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForgotPasswordForm } from "@/features/auth/components/ForgorPasswordForm";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { RegisterOtpVerification } from "@/features/auth/components/RegisterOtpVerification";
import { ForgotPasswordOtpVerification } from "@/features/auth/components/ResetOtpVerification";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import AuthCarousel from "../../../features/auth/components/AuthCarousal";
import ExpertiseSelection from "../../../features/auth/components/ExpertiseSelectionForm";

export const Route = createFileRoute("/(public)/auth/")({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      error: search.error as string || undefined,
    };
  },
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState("login");
  const [showOtp, setShowOtp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotPasswordOtp, setShowForgotPasswordOtp] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [showExpertiseSelection, setShowExpertiseSelection] = useState(false);
  
  // Get error parameter from URL
  const { error } = Route.useSearch();

  if (showExpertiseSelection) {
    return (
      <ExpertiseSelection
        email={registeredEmail}
        onComplete={() => setShowExpertiseSelection(false)}
      />
    );
  }
  
  return (
    <div className="min-h-[calc(100vh-1rem)] grid lg:grid-cols-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-background via-background/95 to-muted/30 pointer-events-none"></div>

      <AuthCarousel />

      <div className="flex justify-center items-center p-8 bg-linear-to-bl from-muted/10 via-background to-secondary/5 relative">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-linear-to-bl from-primary/10 to-transparent rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-linear-to-tr from-secondary/15 to-transparent rounded-full blur-2xl opacity-40"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Theme-aware Error Alert */}
          {error === "blocked" && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive dark:bg-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Account Blocked</AlertTitle>
              <AlertDescription>
                Your account has been blocked. Please contact support for assistance.
              </AlertDescription>
            </Alert>
          )}
          
          {!showForgotPassword &&
            !showForgotPasswordOtp &&
            !showResetPassword && (
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                  Welcome to UpStride
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
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

          <div className="bg-linear-to-br from-card/80 to-card/60 rounded-2xl shadow-2xl border border-border/50 p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-primary/5 rounded-2xl"></div>

            <div className="relative z-10">
              {showOtp ? (
                <RegisterOtpVerification
                  onOtpExpired={() => {
                    setShowOtp(false);
                  }}
                  onOtpVerified={() => {
                    setShowOtp(false);
                    setShowExpertiseSelection(true);
                  }}
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
                  <TabsList className="grid grid-cols-2 mb-6 w-full bg-linear-to-r from-muted/50 to-muted/30 backdrop-blur-sm border border-border/30">
                    <TabsTrigger
                      className="cursor-pointer transition-all duration-300 data-[state=active]:bg-linear-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground"
                      value="login"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger
                      className="cursor-pointer transition-all duration-300 data-[state=active]:bg-linear-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground"
                      value="register"
                    >
                      Register
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <LoginForm
                      onRegisterSuccess={(email) => {
                        setRegisteredEmail(email);
                        setShowExpertiseSelection(true);
                      }}
                      setActiveTab={setActiveTab}
                      setForgotpassword={setShowForgotPassword}
                    />
                  </TabsContent>
                  <TabsContent value="register">
                    <RegisterForm
                      onRegisterSuccess={(email) => {
                        setRegisteredEmail(email);
                        setShowExpertiseSelection(true);
                      }}
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
    </div>
  );
}
