import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { PlusIcon, MinusIcon } from '@/assets/bar';

export default function SideBar({ menus = [], headerTitle = '메뉴' }) {
  const defaultOpenIndex = menus.findIndex((menu) =>
    menu.subItems.some((sub) => sub.isSelected)
  );

  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);
  const [heights, setHeights] = useState({});
  const menuRefs = useRef([]);
  const navigate = useNavigate();

  // 메뉴별 실제 높이를 한 번 계산
  useEffect(() => {
    const newHeights = {};
    menus.forEach((_, i) => {
      const el = menuRefs.current[i];
      if (el) newHeights[i] = el.scrollHeight;
    });
    setHeights(newHeights);
  }, [menus]);

  const toggleMenu = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    /* 상단 */
    <aside className='w-[240px]'>
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
            <div
              ref={(el) => (menuRefs.current[index] = el)}
              style={{
                maxHeight:
                  openIndex === index ? `${heights[index] || 0}px` : '0px',
                transition: 'max-height 0.3s ease-in-out',
                overflow: 'hidden',
              }}
              className='divide-y divide-[var(--color-table-border)] bg-white'
            >
              {menu.subItems.map((sub, i) => (
                <button
                  key={i}
                  onClick={() => navigate(sub.path)}
                  style={{ transitionDelay: '0ms' }}
                  className={`block h-[40px] w-full cursor-pointer px-[10px] text-left text-base hover:bg-[var(--color-light-gray)] ${
                    sub.isSelected
                      ? 'text-[var(--color-gold)]'
                      : 'text-[var(--color-main)]'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
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
