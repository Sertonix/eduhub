// do not remove this https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
import path from 'path';
path.resolve('./next.config.js');

import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { FC, useCallback, useState } from 'react';
import CourseListTable from '../../../components/ManageCoursesContent';
import CoursesHeader from '../../../components/ManageCoursesContent/CoursesHeader';
import Loading from '../../../components/common/Loading';
import { Page } from '../../../components/Page';
import { useAdminQuery } from '../../../hooks/authedQuery';
import { useIsAdmin, useIsLoggedIn } from '../../../hooks/authentication';
import { ADMIN_COURSE_LIST } from '../../../queries/courseList';
import { PROGRAMS_WITH_MINIMUM_PROPERTIES } from '../../../queries/programList';
import {
  AdminCourseList,
  AdminCourseListVariables,
} from '../../../queries/__generated__/AdminCourseList';
import {
  Programs,
  Programs_Program,
} from '../../../queries/__generated__/Programs';

const Index: FC = () => {
  const isAdmin = useIsAdmin();
  const isLoggedIn = useIsLoggedIn();
  const { t } = useTranslation('course-page');
  return (
    <>
      <Head>
        <title>EduHub | opencampus.sh</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <div className="min-h-[77vh]">
          {isLoggedIn && isAdmin && <CoursesDashBoard />}
        </div>
      </Page>
    </>
  );
};

export default Index;

export const QUERY_LIMIT = 50;

const CoursesDashBoard: FC = () => {
  const programListRequest = useAdminQuery<Programs>(
    PROGRAMS_WITH_MINIMUM_PROPERTIES
  ); // Load Program list from db

  if (programListRequest.error) {
    console.log(programListRequest.error);
  }
  if (programListRequest.loading) {
    return <Loading />;
  }
  const ps = [...(programListRequest?.data?.Program || [])];
  return ps.length > 0 ? <Content programs={ps} /> : <></>;
};

interface IProps {
  programs: Programs_Program[];
}
const Content: FC<IProps> = ({ programs }) => {
  const defaultProgram = programs[0].id;
  const { t } = useTranslation('course-page');

  const [filter, setFilter] = useState<AdminCourseListVariables>({
    limit: QUERY_LIMIT,
    offset: 0,
    where: { programId: { _eq: defaultProgram } },
  });

  const courseListRequest = useAdminQuery<
    AdminCourseList,
    AdminCourseListVariables
  >(ADMIN_COURSE_LIST, {
    variables: filter,
  });

  const updateFilter = useCallback(
    (newState: AdminCourseListVariables) => {
      setFilter(newState);
    },
    [setFilter]
  );

  if (courseListRequest.error) {
    console.log(courseListRequest.error);
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <CoursesHeader
        programs={programs}
        defaultProgramId={defaultProgram}
        courseListRequest={courseListRequest}
        t={t}
        updateFilter={updateFilter}
        currentFilter={filter}
      />
      {courseListRequest.loading ? (
        <Loading />
      ) : courseListRequest.data?.Course &&
        courseListRequest.data?.Course.length > 0 ? (
        <CourseListTable
          courseListRequest={courseListRequest}
          programs={programs}
          t={t}
          updateFilter={updateFilter}
          currentFilter={filter}
        />
      ) : (
        <div className="text-white">
          <p>{t('course-page:no-courses')}</p>
        </div>
      )}
    </div>
  );
};
