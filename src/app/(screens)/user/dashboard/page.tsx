'use client'

import React from 'react'
import { useUser } from '@/app/contexts/UserContext'

const DashboardPage = () => {
    const { user, groupsAdmin, userCategories, signOut } = useUser();
    
    return (
        <div>
        <h1>{JSON.stringify(user)}</h1>
        <h1>{JSON.stringify(groupsAdmin)}</h1>
        <h1>{JSON.stringify(userCategories)}</h1>
        <button onClick={signOut}>Sign Out</button>
        </div>
    )
}

export default DashboardPage