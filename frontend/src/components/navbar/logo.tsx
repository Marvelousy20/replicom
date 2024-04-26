import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="w-[100px] h-[50px]">
      <div className="flex gap-x-[20px] items-center">
        <Image
          src="/img/logo.svg"
          alt="logo"
          width={40}
          height={40}
        />
        <h1 className="hidden md:block font-bold text-[20px] dark:text-white text-dark">OpenAI</h1>

      </div>
    </Link>
  );
};

export default Logo; 