import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="w-[100px] h-[50px]">
      <Image
        src="/img/logo.gif"
        alt="logo"
        width={40}
        height={40}
        className="rounded-[20px]"
      />
    </Link>
  );
};

export default Logo; 