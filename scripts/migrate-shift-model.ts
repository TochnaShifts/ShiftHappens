import { getDocs, updateDoc, collection } from 'firebase/firestore';
import { db } from '../src/app/shared/firebase/clientApp';

async function migrateShiftModel() {
  console.log('Starting shift model migration...');
  
  const snapshot = await getDocs(collection(db, 'shifts'));
  let updatedCount = 0;
  let skippedCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const updates: any = {};

    // Check if migration is needed
    const needsMigration = 
      data.includedUserCategories !== undefined || 
      data.excludedUserCategories !== undefined || 
      data.points !== undefined ||
      data.details === undefined;

    if (!needsMigration) {
      console.log(`Shift ${doc.id} already migrated, skipping...`);
      skippedCount++;
      continue;
    }

    // Rename includedUserCategories to requiredUserCategories
    if (data.includedUserCategories !== undefined) {
      updates.requiredUserCategories = data.includedUserCategories;
      updates.includedUserCategories = null; // Will be deleted
    }

    // Rename excludedUserCategories to forbiddenUserCategories
    if (data.excludedUserCategories !== undefined) {
      updates.forbiddenUserCategories = data.excludedUserCategories;
      updates.excludedUserCategories = null; // Will be deleted
    }

    // Convert points to pointsPerHour (existing points are already per hour)
    if (data.points !== undefined) {
      updates.pointsPerHour = data.points;
      updates.points = null; // Will be deleted
    }

    // Add details field if it doesn't exist
    if (data.details === undefined) {
      updates.details = '';
    }

    try {
      await updateDoc(doc.ref, updates);
      console.log(`✅ Updated shift ${doc.id}:`, {
        requiredUserCategories: updates.requiredUserCategories?.length || 0,
        forbiddenUserCategories: updates.forbiddenUserCategories?.length || 0,
        pointsPerHour: updates.pointsPerHour,
        details: updates.details !== undefined ? 'added' : 'already exists'
      });
      updatedCount++;
    } catch (error) {
      console.error(`❌ Failed to update shift ${doc.id}:`, error);
    }
  }

  console.log('\n=== Migration Summary ===');
  console.log(`Total shifts processed: ${snapshot.docs.length}`);
  console.log(`Shifts updated: ${updatedCount}`);
  console.log(`Shifts skipped (already migrated): ${skippedCount}`);
  console.log('Migration complete!');
}

migrateShiftModel().catch(console.error); 