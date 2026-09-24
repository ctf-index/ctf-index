"use client";
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation";

const page = () => {

  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter();

  async function submit() {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: emailOrUsername,
      password: password
    })

    console.log(result);
    
      if (result?.error) {
        console.log('Login Failed', { // replace console.log with toast
        description: result.error
      })
    } 

    if (result?.url) {
      router.replace('/admin')
    }
    
  }
  return (
    <div className="h-screen flex items-center justify-center bg-gray-600">
      <div className="flex flex-col">
        <input className="outline-1" onChange={(e) => setEmailOrUsername(e.target.value)} type="text" />
        <input className="outline-1" onChange={(e) => setPassword(e.target.value)}  type="password" />
        <button onClick={submit}>submit</button>
      </div>
    </div>
  )
}

export default page