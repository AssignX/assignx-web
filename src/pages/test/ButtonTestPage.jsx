import React from "react";
import { SearchIcon, SaveIcon, PlusIcon } from '@/assets/icons';
import Button from '@/components/buttons/Button';
import ButtonGroup from '@/components/buttons/ButtonGroup';

export default function ButtonTestPage() {
  return (
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
  );
}
