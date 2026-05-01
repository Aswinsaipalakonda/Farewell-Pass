import { useState, useEffect } from 'react';
import { client, databases, DB_ID, STUDENTS_COLLECTION_ID } from '@/lib/appwrite';
import { StatsData } from '@/types';
import { Query } from 'appwrite';

export function useStats() {
  const [stats, setStats] = useState<StatsData>({
    totalRegistered: 0,
    checkedIn: 0,
    foodCollected: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // In a real production app with thousands of records, we might use server-side aggregation.
      // For ~1000 event scale, we can fetch all or count documents.
      const total = await databases.listDocuments(DB_ID, STUDENTS_COLLECTION_ID, [Query.limit(1000)]);
      
      let checkedInCount = 0;
      let foodCollectedCount = 0;

      total.documents.forEach(doc => {
        if (doc.checkedIn) checkedInCount++;
        if (doc.foodCollected) foodCollectedCount++;
      });

      setStats({
        totalRegistered: total.total,
        checkedIn: checkedInCount,
        foodCollected: foodCollectedCount,
        pending: total.total - checkedInCount,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Subscribe to realtime updates
    const unsubscribe = client.subscribe(
      `databases.${DB_ID}.collections.${STUDENTS_COLLECTION_ID}.documents`,
      (response) => {
        // We can either update specific stats or just re-fetch for simplicity at this scale
        fetchStats();
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return { stats, loading, fetchStats };
}
