import TextLogo from "@/public/text-logo";

export default function NavbarSkeleton() {
  return (
    <nav className="fixed z-10 top-0 left-0 w-full bg-background/80 shadow-sm backdrop-blur-[12px] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <TextLogo className="w-20 sm:w-20 h-10" />
          </div>
        </div>
      </div>
    </nav>
  );
}
