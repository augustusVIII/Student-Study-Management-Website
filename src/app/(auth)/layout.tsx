export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/image/bg-auth.png)' }}
        aria-hidden="true"
      />
      {/* Overlay gradient + blur nhẹ để tăng độ tương phản form */}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.86),rgba(255,255,255,0.66)_30%,rgba(255,255,255,0.6)_60%,rgba(255,255,255,0.4))] backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
