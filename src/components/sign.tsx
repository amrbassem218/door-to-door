import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { getDisplayName, handleGoogleAuth, handleLogout, useUser } from '@/utilities';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface ISignProps {
}

const Sign: React.FunctionComponent<ISignProps> = (props) => {
  const user = useUser();
  return (
    <div>
      {
        user
        ? 
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className='font-medium text-text  hover:text-primary hover:underline text-left hidden md:inline'>
              <p className='text-xs'>Hello there,</p>
              <p className='text-heading text-xs'>{getDisplayName(user)}</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>
                  <button className='text-red-500' onClick={() => handleLogout()}>Log out</button>
                </DropdownMenuItem>
              {/* <DropdownMenuGroup>
              </DropdownMenuGroup> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
          :<Dialog>
            <DialogTrigger className='font-medium text-text text-sm hover:text-primary hover:underline'>
              Hello there, <br/>
              Sign in/ Register
            </DialogTrigger>
          <DialogContent className='p-10 w-120 '>
            <DialogHeader className='mx-auto'>
              <DialogTitle className='text-center'>Sign In/ Register</DialogTitle>
              <DialogDescription className=''>Continue with your email and password</DialogDescription>
            </DialogHeader>
            <div>
              <form action="" className='space-y-3 flex flex-col '>
                <Input type='email' id='email' placeholder='Email'></Input>
                <Input type='password' placeholder='Password'></Input>
                <Button type='submit' >Submit</Button>
              </form>
            </div>
            <div>
              <div className="flex items-center w-full my-4">
                <Separator className="h-px bg-gray-300 flex-1" />
                <p className="px-4 text-sm text-gray-500 whitespace-nowrap">or continue with</p>
                <Separator className="h-px bg-gray-300 flex-1" />
              </div>
              <div className=''>
                <div className='flex gap-3 justify-around'>
                  <button><FcGoogle size={40} onClick={() => handleGoogleAuth()}/></button>
                  <button><FaFacebook size={40} className='text-[#1877F2]'/></button>
                  <button><FaApple size={40}/></button>
                  <button><FaSquareXTwitter size={40}/></button>
                </div>
              </div>
            </div>
            {/* TOS */}
            <div className='mt-4'>
            <p className='text-xs text-text text-center'>By continuing, you confirm that you are an adult and have read and accepted our Free Membership Agreement and Privacy Policy. Your information may be used for marketing purposes, but you can opt out at any time.</p>
            </div>
          </DialogContent>
        </Dialog>
      }
    </div>
  );
};

export default Sign;
