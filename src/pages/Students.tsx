import { useState, useMemo } from 'react';
import { useStudents } from '@/hooks/useStudents';
import { StudentTable } from '@/components/students/StudentTable';
import { StudentCard } from '@/components/students/StudentCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, XCircle, Plus, UserPlus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { databases, DB_ID, STUDENTS_COLLECTION_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { toast } from 'sonner';

type FilterType = 'All' | 'Checked In' | 'Food Done' | 'Pending';

export function Students() {
  const { students, loading, fetchStudents } = useStudents();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ id: '', name: '', branch: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.id) {
      toast.error('Student ID is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await databases.createDocument(
        DB_ID,
        STUDENTS_COLLECTION_ID,
        ID.unique(),
        {
          studentId: newStudent.id,
          name: newStudent.name || newStudent.id, // Fallback to ID if name is empty
          branch: newStudent.branch || 'General',
          checkedIn: false,
          foodCollected: false,
          checkInTime: '',
          foodTime: ''
        }
      );
      toast.success(`Student ${newStudent.id} added successfully`);
      setIsAddDialogOpen(false);
      setNewStudent({ id: '', name: '', branch: '' });
      fetchStudents();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to add student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search match
      const searchLower = search.toLowerCase();
      const matchesSearch = student.name.toLowerCase().includes(searchLower) || 
                            student.studentId.toLowerCase().includes(searchLower);
      
      // Filter match
      let matchesFilter = true;
      if (filter === 'Checked In') matchesFilter = student.checkedIn;
      else if (filter === 'Food Done') matchesFilter = student.foodCollected;
      else if (filter === 'Pending') matchesFilter = !student.checkedIn;

      return matchesSearch && matchesFilter;
    });
  }, [students, search, filter]);

  const filters: FilterType[] = ['All', 'Checked In', 'Food Done', 'Pending'];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-6 animate-fade-in-up">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-syne text-2xl lg:text-3xl font-bold mb-2">Student List</h1>
          <p className="text-text-muted">Manage and view all registered students.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent-purple hover:bg-accent-purple/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-bg-surface border-border-glass">
            <DialogHeader>
              <DialogTitle className="font-syne text-xl">Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="sid">Student ID (Required)</Label>
                <Input 
                  id="sid" 
                  placeholder="e.g. 21A91A0501" 
                  value={newStudent.id}
                  onChange={(e) => setNewStudent({...newStudent, id: e.target.value})}
                  className="bg-bg-base border-border-glass"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. John Doe" 
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  className="bg-bg-base border-border-glass"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch / Department</Label>
                <Input 
                  id="branch" 
                  placeholder="e.g. CSE" 
                  value={newStudent.branch}
                  onChange={(e) => setNewStudent({...newStudent, branch: e.target.value})}
                  className="bg-bg-base border-border-glass"
                />
              </div>
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-border-glass"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-accent-purple hover:bg-accent-purple/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Student'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input 
            placeholder="Search by name or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-bg-surface/50 border-border-glass text-text-primary focus:border-accent-purple"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {filters.map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? 'bg-accent-purple hover:bg-accent-purple/90 text-white border-transparent' : 'bg-transparent border-border-glass text-text-muted hover:text-text-primary hover:bg-bg-glass'}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="text-sm text-text-muted">
        Showing {filteredStudents.length} of {students.length} students
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl bg-bg-surface/50" />)}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card">
          <XCircle className="w-12 h-12 text-text-muted mb-4 opacity-50" />
          <h3 className="text-lg font-syne mb-1">No students found</h3>
          <p className="text-text-muted text-sm mb-4">Try adjusting your search or filters.</p>
          {(search || filter !== 'All') && (
            <Button variant="outline" onClick={() => { setSearch(''); setFilter('All'); }} className="border-border-glass">
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <StudentTable students={filteredStudents} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {filteredStudents.map(student => (
              <StudentCard key={student.$id} student={student} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
