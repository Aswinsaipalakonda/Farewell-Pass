import { useState, useEffect, useCallback } from 'react';
import { client, databases, DB_ID, STUDENTS_COLLECTION_ID } from '@/lib/appwrite';
import { Student } from '@/types';
import { Query } from 'appwrite';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments(
        DB_ID,
        STUDENTS_COLLECTION_ID,
        [Query.limit(1000)]
      );
      
      const parsedStudents = response.documents.map(doc => ({
        $id: doc.$id,
        studentId: doc.studentId,
        name: doc.name || '',
        branch: doc.branch || '',
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

    // Realtime subscription
    const unsubscribe = client.subscribe(
      `databases.${DB_ID}.collections.${STUDENTS_COLLECTION_ID}.documents`,
      (response) => {
        // Just re-fetch to keep it simple and accurate
        fetchStudents();
      }
    );

    return () => unsubscribe();
  }, [fetchStudents]);

  const deleteStudent = async (documentId: string) => {
    try {
      console.log('Hook: Deleting student:', documentId);
      await databases.deleteDocument(DB_ID, STUDENTS_COLLECTION_ID, documentId);
      setStudents(prev => prev.filter(s => s.$id !== documentId));
      return true;
    } catch (error) {
      console.error('Hook: Delete error:', error);
      throw error;
    }
  };

  return { students, loading, fetchStudents, deleteStudent };
}
