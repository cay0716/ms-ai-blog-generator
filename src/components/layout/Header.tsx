import DarkModeBtn from "@/components/ui/DarkModeBtn";
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return(
    <header className="w-full flex items-center justify-center py-4">
      <ul className="flex w-full max-w-3xl justify-between px-8">
        <li>
            <Link href="/">
              <Image
                src="/img/logo.svg"
                alt="로고"
                width={35}
                height={35}
                priority
                className="cursor-pointer"
              />
          </Link>
        </li>
        <li><DarkModeBtn /></li>
      </ul>
    </header>
  )
}