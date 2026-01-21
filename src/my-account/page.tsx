import { auth } from '@/auth/authSetup';
import React from 'react'

async function page() {
    const session = await auth();

    if (!session) {
        return (
            <div>
                Giriş yapmadınız! hemen giriş yapınız
            </div>
        );
    }

    const user = session.user;

    const userInfo = {
        name: user?.name,
        email: user?.email
    };

    return (
        <div>
            <div>This is your account</div>
            <div>{userInfo.name}</div>
            <div>{userInfo.email}</div>
        </div>
    )
}

export default page;