import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { ShiftStatus } from '../src/app/shared/types/enums'
import { db } from '../src/app/shared/firebase/clientApp'

async function migrateShiftStatus() {
  console.log('Starting shift status migration...')
  
  try {
    // Get all shifts from the database
    const shiftsCollection = collection(db, 'shifts')
    const shiftsSnapshot = await getDocs(shiftsCollection)
    
    console.log(`Found ${shiftsSnapshot.size} shifts to migrate`)
    
    let updatedCount = 0
    let errorCount = 0
    
    // Process each shift
    for (const shiftDoc of shiftsSnapshot.docs) {
      try {
        const shiftData = shiftDoc.data()
        
        // Check if the shift already has a status field
        if (shiftData.status !== undefined) {
          console.log(`Shift ${shiftDoc.id} already has status field, skipping...`)
          continue
        }
        
        // Convert isFinished boolean to status enum
        let newStatus: ShiftStatus
        
        if (shiftData.isFinished === true) {
          newStatus = ShiftStatus.Finished
        } else if (shiftData.isFinished === false) {
          newStatus = ShiftStatus.Active
        } else {
          // Default to Active if isFinished is undefined
          newStatus = ShiftStatus.Active
        }
        
        // Update the document - add status field and remove isFinished
        const shiftRef = doc(db, 'shifts', shiftDoc.id)
        await updateDoc(shiftRef, {
          status: newStatus,
          isFinished: null // This will remove the field from Firestore
        })
        
        console.log(`Updated shift ${shiftDoc.id}: isFinished=${shiftData.isFinished} -> status=${newStatus}`)
        updatedCount++
        
      } catch (error) {
        console.error(`Error updating shift ${shiftDoc.id}:`, error)
        errorCount++
      }
    }
    
    console.log(`\nMigration completed!`)
    console.log(`✅ Successfully updated: ${updatedCount} shifts`)
    console.log(`❌ Errors: ${errorCount} shifts`)
    
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
migrateShiftStatus()
  .then(() => {
    console.log('Migration script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration script failed:', error)
    process.exit(1)
  }) 