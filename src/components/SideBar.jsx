import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { PlusIcon, MinusIcon } from '@/assets/bar';

export default function SideBar({ menus = [], headerTitle = '메뉴' }) {
  const defaultOpenIndex = menus.findIndex((menu) =>
    menu.subItems.some((sub) => sub.isSelected)
  );

  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);
  const navigate = useNavigate();

  const toggleMenu = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    /* 상단 */
    <aside className='w-[240px] bg-[var(--color-white)]'>
      <div className='bg-[var(--color-dark-gray)] py-[30px] text-center text-xl font-bold text-white'>
        {headerTitle}
      </div>
      <div>
        {menus.map((menu, index) => (
          <div key={index}>
            {/* 메인 메뉴 버튼 */}
            <button
              onClick={() => toggleMenu(index)}
              className='flex h-[40px] w-full cursor-pointer items-center justify-between bg-[var(--color-gold)] px-[10px] text-base font-medium text-[var(--color-white)]'
            >
              {menu.title}
              <span className='w-[24px]'>
                {openIndex === index ? <MinusIcon /> : <PlusIcon />}
              </span>
            </button>
            {/* 서브 메뉴 버튼 */}
            {openIndex === index && (
              <div className='bg-white'>
                {menu.subItems.map((sub, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      navigate(sub.path);
                    }} // 페이지 이동
                    className={`hover:bg-light-gray block h-[40px] w-full cursor-pointer px-[10px] text-left text-base ${
                      sub.isSelected
                        ? 'text-[var(--color-gold)]'
                        : 'text-[var(--color-main)]'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

SideBar.propTypes = {
  headerTitle: PropTypes.string,
  menus: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subItems: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
          isSelected: PropTypes.bool,
        })
      ).isRequired,
    })
  ),
};
