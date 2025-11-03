import Section from '@/components/common/Section';
import PageHeader from '@/components/headers/PageHeader';
import SectionHeader from '@/components/headers/SectionHeader';

function ApplicationStatusPage() {
  const subTitle = 'N건';
  return (
    <Section>
      <PageHeader title='시간표 조회' />
      {/* 가로 폼 */}

      <SectionHeader title='과목 조회 목록' subtitle={subTitle} />
      {/* 테이블 */}

      <SectionHeader title='강의 시간표' />
      {/* 타임테이블 */}
    </Section>
  );
}

export default ApplicationStatusPage;
