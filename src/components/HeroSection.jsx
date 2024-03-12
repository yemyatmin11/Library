import React from 'react'

export default function HeroSection() {
  return (
    <div className='bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 h-48 flex justify-center items-center'>
        <div className="space-y-2">
            <h1 className="text-3xl text-white">Welcome from my library</h1>
            <p className="text-gray-300 text-sm text-center">A place you can store and manage your books.</p>
        </div>
    </div>
  )
}
