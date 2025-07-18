import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const UnderConstructionPage = async (props) => {

  return (
     <div className='flex flex-col items-center justify-center'>
        <div className=" flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <p className="text-center text-2xl font-semibold text-gray-800 mb-2">
          🚧{props.name} <br />Under Construction
        </p>
        <p className="text-center text-gray-600 mb-6">
          This page is being built.<br />
          <span className="text-base text-gray-500">It will be ready soon!</span>
        </p>
        <Link href="/" passHref>
          <Button className="w-full">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}

export default UnderConstructionPage

// {id, name, type, balance, isDefault, userId, createdAt, updatedAt, _count}).