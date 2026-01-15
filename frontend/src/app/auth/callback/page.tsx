/**
 * Auth callback page for Better Auth.
 * Handles the redirect after email link authentication.
 */

export default function AuthCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <p className="text-gray-600">Please wait while we verify your authentication.</p>
      </div>
    </div>
  );
}
