import { useState, useEffect, useCallback } from 'react';
import { databases, DB_ID, STUDENTS_COLLECTION_ID } from '@/lib/appwrite';
import { Student } from '@/types';
import { Query } from 'appwrite';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      // Assuming maximum of 1000 for event
      const response = await databases.listDocuments(
        DB_ID,
        STUDENTS_COLLECTION_ID,
        [Query.limit(1000)]
      );
      
      const parsedStudents = response.documents.map(doc => ({
        $id: doc.$id,
        studentId: doc.studentId,
        name: doc.name,
        branch: doc.branch,
        checkedIn: doc.checkedIn,
        foodCollected: doc.foodCollected,
        checkInTime: doc.checkInTime,
        foodTime: doc.foodTime,
      }));
      
      setStudents(parsedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, loading, fetchStudents };
}
