'use client'

import React from 'react'
import { useUser } from '@/app/contexts/UserContext'
import { useParams } from 'next/navigation';

const DashboardPage = () => {
    const { user, userGroups, groupsAdmin, userCategories, signOut } = useUser();
    
    const currentGroupId = useParams().groupId;
    
    return (
        <div>
        <h1>ניהול קבוצה {currentGroupId}</h1>
        </div>
    )
}

export default DashboardPage