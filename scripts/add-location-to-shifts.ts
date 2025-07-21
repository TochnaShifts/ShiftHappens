import { getDocs, updateDoc, collection } from 'firebase/firestore';
import { db } from '../src/app/shared/firebase/clientApp';

async function addLocationToShifts() {
  const locations = ['מחנה גדעונים', 'מצודת עוז'];
  const snapshot = await getDocs(collection(db, 'shifts'));
  let count = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data.location) {
      const location = locations[count % locations.length];
      await updateDoc(doc.ref, { location });
      console.log(`Updated shift ${doc.id} with location: ${location}`);
      count++;
    } else {
      console.log(`Shift ${doc.id} already has location: ${data.location}`);
    }
  }
  console.log('Location update complete.');
}

addLocationToShifts().catch(console.error); 