import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Branded panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden">
        <Image
          src="/images/backgrounds/login-background.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="relative z-10">
          <Image src="/logo-light.svg" alt="ThunderFlow" width={200} height={48} />
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            Automate the work<br />that slows your team down.
          </h2>
          <p className="text-white/80 max-w-md">
            Join thousands of teams using ThunderFlow to ship reliable,
            observable business workflows in minutes.
          </p>
          <div className="flex items-center gap-4 pt-4">
            {["SOC 2 Type II", "GDPR", "99.9% uptime"].map((b) => (
              <span key={b} className="rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex min-h-screen items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
