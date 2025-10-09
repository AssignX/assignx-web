import SYClassRoomTable from '@/components/table/test/SYClassRoomTable.jsx';
import AdminEditClassRoomTable from '@/components/table/test/AdminEditClassRoomTable.jsx';
import ProfUndeterminedSubject from '@/components/table/test/ProfUndeterminedSubject.jsx';
import SYSearchTable from '@/components/table/test/SYSearchTable.jsx';
import Prof1stExamTable from '@/components/table/test/Prof1stExamTable.jsx';

export default function TableTestPage() {
  return (
    <div>
      <h1>tabletest</h1>
      <div className='w-[500px]'>
        <SYClassRoomTable />
      </div>
      <div className='w-[1120px]'>
        <AdminEditClassRoomTable />
      </div>
      <div className='w-[1100px]'>
        <ProfUndeterminedSubject />
      </div>
      <div>
        <SYSearchTable />
      </div>
      <div className='w-[1300px]'>
        <Prof1stExamTable />
      </div>
    </div>
  );
}
