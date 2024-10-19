'use client';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import LeftArrow from '@/assets/icons/ic_arrow_left.svg';
import RightArrow from '@/assets/icons/ic_arrow_right.svg';
import BtnCalendar from '@/assets/icons/btn_calendar.svg';
import ListCard from '@/components/pages/list/ListCard';
import FilterSelection from '@/components/pages/list/FilterSelection';
import { format, addDays, subDays } from 'date-fns';
import Calendar from '@/components/calendar/Calendar';
import { useModalStore } from '@/store/useModalStore';
import ModalPortal from '@/components/ModalPortal/ModalPortal';
import ModalToDo from '@/components/modal/ModalToDo';
import ModalNewList from '@/components/modal/ModalNewList';
import { useQuery } from '@tanstack/react-query';
import { useModalNewListStore } from '@/store/useModalNewListStore';
import { useModalToDoStore } from '@/store/useModalToDoStore';
import { useParams } from 'next/navigation';
import useSessionStore from '@/store/useSessionStore';
import useUser from '@/hooks/useUser';
import useGroup from '@/hooks/useGroup';
import { Task, TaskList } from '@/types/Group';
import { authAxiosInstance } from '@/app/api/auth/axiosInstance';
import { getTaskList } from '@/api/taskListApis';
import { createTaskList } from '@/api/taskListApis';

export default function List() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useSessionStore();
  const { userData } = useUser(user?.id);
  const { group, isLoading, error } = useGroup(groupId);

  // 날짜 및 캘린더 상태 관리
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectDate, setSelectDate] = useState<Date | null>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const getDayOfWeek = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(date);
  };

  const handlePrevDay = () => {
    if (selectDate) {
      setSelectDate(subDays(selectDate, 1)); // 하루 전으로 이동
    }
  };

  const handleNextDay = () => {
    if (selectDate) {
      setSelectDate(addDays(selectDate, 1)); // 하루 앞으로 이동
    }
  };

  const handleClickOutsideCalendar = (event: MouseEvent) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideCalendar);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideCalendar);
    };
  }, []);

  // 리스트 카드 드롭다운 상태 관리
  const [selectedOption, setSelectedOption] = useState<string>('');
  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  // 체크박스 상태 관리
  const [taskStates, setTaskStates] = useState<Record<number, boolean>>({});
  const handleCheckboxChange = (taskId: number, checked: boolean) => {
    setTaskStates((prevState) => ({
      ...prevState,
      [taskId]: checked,
    }));
  };

  // 모달 상태 관리
  const { closeModal: closeNewListModal, isModalOpen: isNewListOpen } =
    useModalNewListStore();
  const { closeModal: closeToDoModal, isModalOpen: isToDoOpen } =
    useModalToDoStore();

  // 선택된 taskList
  const [selectedTaskList, setSelectedTaskList] = useState<
    TaskList | undefined
  >(undefined);

  // taskList의 task.name 배열을 필터로 전달
  const [taskNames, setTaskNames] = useState<string[]>([]);

  // group이 변경될 때마다 taskNames 초기화
  useEffect(() => {
    const names = group?.taskLists.flatMap((taskList) => taskList.name) || [];
    setTaskNames(names);
  }, [group]);

  const addTasksName = (name: string) => {
    setTaskNames((prev) => [...prev, name]);
  };

  const handleSelectFilter = (filter: string) => {
    // 선택된 필터에 따른 task list 찾기
    const selectedList = group?.taskLists.find(
      (taskList) => taskList.name === filter,
    );
    setSelectedTaskList(selectedList);
    console.log('선택된 task list:', selectedList);
  };

  // Task List 생성 후 서버에 전송하고 다시 불러오기
  const handleCreateTaskList = async (name: string) => {
    try {
      // 기존 task list 이름 중복 확인
      const existingTaskList = group?.taskLists.find(
        (taskList) => taskList.name === name,
      );
      if (existingTaskList) {
        alert('그룹 내 이름이 같은 할 일 목록이 존재합니다.'); // 오류 메시지 표시
        return; // 중복 시 함수 종료
      }

      const newTaskList = await createTaskList(groupId, { name }); // createTaskList 함수 호출
      addTasksName(newTaskList.name); // 새로운 taskList 이름 추가
      refetch(); // 최신 데이터 다시 가져오기
      closeNewListModal(); // 모달 닫기
    } catch (error) {
      console.error('Task list 생성 중 오류:', error);
    }
  };

  // task 불러오기 쿼리
  const { data: tasksResponse, refetch } = useQuery({
    queryKey: [groupId, selectedTaskList, selectDate],
    queryFn: async () => {
      const response = await authAxiosInstance.get(
        `/groups/${groupId}/task-lists/${selectedTaskList?.id}/tasks`,
        {
          params: { date: selectDate?.toISOString() },
        },
      );
      console.log('서버로부터 받아온 tasks 데이터:', response.data);
      console.log('startDate 파라미터:', selectDate?.toISOString());
      return response.data;
    },
    enabled: !!selectedTaskList && !!groupId,
  });
  // // task 불러오기 쿼리
  // const { data: tasksResponse, refetch } = useQuery({
  //   queryKey: [groupId, selectedTaskList, selectDate],
  //   queryFn: async () => {
  //     const response = await authAxiosInstance.get(
  //       `/groups/${groupId}/task-lists/${selectedTaskList?.id}/tasks`,
  //       {
  //         params: { date: selectDate?.toISOString() },
  //       },
  //     );
  //     console.log('서버로부터 받아온 tasks 데이터:', response.data);
  //     console.log('selectDate 파라미터:', selectDate?.toISOString());
  //     return response.data;
  //   },
  //   enabled: !!selectedTaskList && !!groupId,
  // });
  // Task List 선택 후 task 데이터 받아오기
  useEffect(() => {
    if (tasksResponse) {
      setSelectedTaskList((prevList) => {
        if (prevList) {
          return {
            ...prevList,
            tasks: tasksResponse,
          };
        }
        return prevList;
      });
    }
  }, [tasksResponse]);

  //할일 상태 관리
  const [tasks, setTasks] = useState<Task[]>([]);
  const handleCreateTask = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // 콘솔 확인
  console.log('tasksResponse', groupId, selectedTaskList, tasksResponse);
  console.log('isToDoOpen:', isToDoOpen);
  console.log(`taskNames: ${taskNames}`);

  return (
    <div className="lg:w-300.25-custom">
      <span className="font-pretendard mb-27px lg: md-6 h-5.25-custom leading-5.25-custom mt-6 block w-9 whitespace-nowrap text-center text-lg font-bold md:my-6 md:h-6 md:w-10 md:text-xl md:leading-6 lg:mb-6 lg:mt-10 lg:h-6 lg:w-12 lg:text-left">
        할 일
      </span>

      <div className="mb-4 flex justify-between md:mb-6 lg:mb-6">
        <div className="flex space-x-3">
          <div>
            {selectDate
              ? `${format(selectDate, 'MM월 dd일')} (${getDayOfWeek(selectDate)})`
              : '날짜 선택'}
          </div>
          <div className="flex">
            <button onClick={handlePrevDay}>
              <Image src={LeftArrow} alt="LeftArrow" />
            </button>
            <button onClick={handleNextDay}>
              <Image src={RightArrow} alt="RightArrow" />
            </button>
          </div>
          <div className="relative">
            <button onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
              <Image src={BtnCalendar} alt="BtnCalendar" />
            </button>
            {isCalendarOpen && (
              <div
                ref={calendarRef}
                className="absolute left-0 top-full z-50 mt-2 w-[336px] rounded-xl bg-background-secondary shadow-lg"
              >
                <Calendar
                  startDate={selectDate}
                  setStartDate={(date: Date | null) => {
                    setSelectDate(date);
                    setIsCalendarOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => useModalNewListStore.getState().openModal()}
          className="text-md-regular text-brand-primary"
        >
          + 새로운 목록 추가하기
        </button>
        {isNewListOpen && (
          <ModalNewList
            isOpen={isNewListOpen}
            onClose={closeNewListModal}
            onSubmit={handleCreateTaskList} // 새로운 task list를 생성하는 함수 호출
          />
        )}
      </div>

      <FilterSelection
        filters={taskNames || []}
        onSelect={handleSelectFilter}
      />

      {!group?.taskLists || group.taskLists.length === 0 ? (
        <div className="text-md-medium jus mt-[232px] text-center text-text-default md:mt-[393px] lg:mt-[359px]">
          아직 할 일 목록이 없습니다.
          <br />
          새로운 목록을 추가해주세요.
        </div>
      ) : !selectedTaskList || selectedTaskList.tasks.length === 0 ? (
        <div className="text-md-medium jus mt-[191px] text-center text-text-default md:mt-[345px] lg:mt-[310px]">
          아직 할 일이 없습니다.
          <br />할 일을 추가해보세요
        </div>
      ) : (
        selectedTaskList.tasks.map((tasksResponse) => (
          <ListCard
            key={tasksResponse.id}
            task={tasksResponse}
            checked={taskStates[tasksResponse.id] || false}
            onCheckboxChange={(checked) =>
              handleCheckboxChange(tasksResponse.id, checked)
            }
            onSelectOption={handleSelectOption}
          />
        ))
      )}

      <button
        className="fixed bottom-6 right-6 rounded-full bg-brand-primary px-[21px] py-3.5"
        onClick={() => useModalToDoStore.getState().openModal()}
      >
        + 할 일 추가
      </button>
      {isToDoOpen && (
        <ModalToDo
          isOpen={isToDoOpen}
          onClose={closeToDoModal}
          onCreate={handleCreateTask}
          groupId={groupId}
          taskListId={selectedTaskList?.id}
          refetch={refetch}
        />
      )}
    </div>
  );
}
