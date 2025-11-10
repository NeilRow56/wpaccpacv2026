export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 flex min-h-svh flex-col items-center p-6 md:p-10">
      <div className=" mt-12 w-full max-w-xs md:max-w-lg">{children}</div>
    </div>
  );
}
