'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OTPInput } from '@/components/auth/otp-input';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const { verifyResetOTP, resetPassword, isLoading } = useAuthStore();

  const [step, setStep] = useState<'otp' | 'password'>('otp');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleOTPVerify = async () => {
    if (!email || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    await verifyResetOTP(email, otp);
    setStep('password');
    toast.success('OTP verified! Please set your new password.');
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordError('');
    await resetPassword(email, newPassword);
    toast.success('Password reset successfully!');
    router.push('/sign-in');
  };

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Invalid Request</CardTitle>
            <CardDescription>No email provided. Please go back and try again.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/forgot-password">Back to Forgot Password</Link>
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
          <CardTitle className="text-2xl font-bold">
            {step === 'otp' ? 'Verify OTP' : 'Reset Password'}
          </CardTitle>
          <CardDescription>
            {step === 'otp' ? `Enter the 6-digit OTP sent to ${email}` : 'Enter your new password'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'otp' ? (
            <>
              <OTPInput length={6} onComplete={setOtp} />
              <Button
                className="w-full"
                onClick={handleOTPVerify}
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
              </div>
              <Button
                className="w-full"
                onClick={handleResetPassword}
                disabled={isLoading || !newPassword || !confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {step === 'otp' ? (
              <>
                Didn't receive the code?{' '}
                <Link href="/forgot-password" className="text-primary hover:underline">
                  Resend
                </Link>
              </>
            ) : (
              <>
                Remember your password?{' '}
                <Link href="/sign-in" className="text-primary hover:underline">
                  Sign In
                </Link>
              </>
            )}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
