import { Routes, Route } from 'react-router';
import './styles/reset.css';
import './styles/font.css';

export default function App() {
  return (
    <Routes>
      <Route path='/test' element={<TestPage />} />
    </Routes>
  );
}

function TestPage() {
  return <div className='text-3xl font-bold underline'>Hello World!</div>;
}
