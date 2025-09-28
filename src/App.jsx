import { Routes, Route } from 'react-router';
import './styles/font.css';

import SyPage from './pages/sy/Sy.jsx';
import AdminHomePage from './pages/admin/Home.jsx';
import { SearchIcon, SaveIcon, PlusIcon } from '@/assets/icons';
import Button from '@/components/buttons/Button';
import ButtonGroup from '@/components/buttons/ButtonGroup';

export default function App() {
  return (
    <Routes>
      <Route index element={<SyPage />} />
      <Route path='admin' element={<AdminHomePage />} />
      <Route
        path='icontest'
        element={
          <div>
            <h1>icontest</h1>
            <SearchIcon width={40} height={40} />
            <SaveIcon width={40} height={40} />
            <PlusIcon width={40} height={40} />
          </div>
        }
      />
      <Route
        path='buttontest'
        element={
          <div>
            <h1>button</h1>
            <div className="flex gap-[5px]">
              <Button text="신청" color="red" />
              <Button text="수정" color="red" />
              <Button text="삭제" color="red" />
              </div>

            <div className="flex gap-[5px]">
              <Button text="조회" color="gold" />
              <Button text="추가" color="gold" />
              <Button text="버튼" color="gold" />
              <Button text="삭제" color="gold" />
            </div>

            <div className="flex gap-[5px]">
              <Button text="저장" Icon={SaveIcon} color="lightgray" />
              <Button text="조회" Icon={SearchIcon} color="lightgray" />
            </div>

            <h1>buttongroup</h1>
            <ButtonGroup
              buttons={[
                {text: "저장", color: "gold", Icon: SaveIcon},
                {text: "수정", color: "lightgray"},
                {text: "삭제", color: "red"},
              ]}
            />
          </div>

        }
      />
    </Routes>
  );
}
