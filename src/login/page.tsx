import { signIn } from '@/auth/authSetup'
import React from 'react'

function page() {
    return (
        <div>
            <form
                action={async () => {
                    "use server"
                    await signIn("google")
                }}
            >
                <button type="submit">Signin with Google</button>
            </form>
        </div>
    )
}

export default page