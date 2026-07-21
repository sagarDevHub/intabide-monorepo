'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OTPInput } from '@/components/auth/otp-input';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { verifyEmail, resendVerification, isLoading, user } = useAuthStore();

  const [otp, setOtp] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (user?.emailVerified) {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (!email || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    await verifyEmail(email, otp);
    toast.success('Email verified successfully!');
    router.push('/dashboard');
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    await resendVerification(email);
    setIsResending(false);
    setCountdown(60);
    toast.success('Verification OTP resent!');
  };

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Verification Required</CardTitle>
            <CardDescription>No email provided. Please go back and sign up again.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/sign-up">Back to Sign Up</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            We sent a 6-digit OTP to <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <OTPInput length={6} onComplete={setOtp} />
          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>
          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={isResending || countdown > 0}
              className="text-sm text-muted-foreground hover:text-primary transition disabled:opacity-50"
            >
              {isResending
                ? 'Sending...'
                : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Didn't receive the code? Resend"}
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Wrong email?{' '}
            <Link href="/sign-up" className="text-primary hover:underline">
              Go back
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
