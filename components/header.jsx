import React from 'react'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import '../app/globals.css' 
import { checkUser } from '@/lib/checkUser'



const Header = async () => {
  await checkUser();
  return (
    <div className='fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b   '>
      <nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <Link  href="/" >
        <Image src={"/logo.png"} alt="welth app logo" height={60} width={200} className='h-12 w-auto object-contain'/>
        </Link>
  <div className='flex items-center space-x-4 '>
    <SignedIn>
      <Link href="/dashboard" className='text-gray-800 hover:text-blue-600' flex items-center gap-2> 
      <Button>
        <LayoutDashboard size={18}/>
        <span className='hidden md:inline'>Dashboard</span>
      </Button>
      </Link>
      <Link href="/transaction/create" className='flex items-center gap-2'>
      <Button variant="outline"> 
        <PenBox size={18}/>
        <span  className='hidden md:inline'> Add Transaction </span>
      </Button>
      </Link>
    </SignedIn>

     <SignedOut>
  <SignInButton forceRedirectUrl='/dashboard' aschild="true">
    <Button variant="outline">Login</Button>
  </SignInButton>
  {/* <SignUpButton /> */}
</SignedOut>
  <SignedIn>
      <UserButton
  appearance={{
    elements: {
      avatarBox: "w-100 h-100",
    },
  }}
/>
  </SignedIn>
  </div>   
 
   </nav>
    </div>
    
  )
}

export default Header