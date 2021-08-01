import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { getFilteredEvents } from '../../helpers/api-util';
import EventList from '../../components/events/EventList';
import ResultsTitle from '../../components/events/ResultsTitle';
import Button from '../../components/ui/button';
import ErrorAlert from '../../components/ui/ErrorAlert';

const FilteredEventsPage = (props) => {
  const [events, setEvents] = useState();
  const router = useRouter();

  const filterData = router.query.slug;

  // ルートパラメーターを取得した後にuseSWRでリクエスト送信
  const { data, error } = useSWR('https://next-js-course-8dedf-default-rtdb.firebaseio.com/events.json');

  useEffect(() => {
    if (data) {
      const events = [];

      for (const key in data) {
        events.push({
          id: key,
          ...data[key]
        })
      }
      setEvents(events);
    }
  }, [data])

  // フィルターに問題がないか確認する処理
  if (!events) {
    return <p className="center">Loading...</p>
  }

  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  if (isNaN(numYear) || isNaN(numMonth) || numYear < 2021 || numMonth > 12 || error) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>フィルタが無効です。値を調整してください！</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    )
  }
  
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === numYear && eventDate.getMonth() === numMonth - 1;
  });

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>選択したイベントが見つかりません！</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    )
  }

  const date = new Date(numYear, numMonth - 1);

  return(
    <Fragment>
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  )
}

// export async function getServerSideProps(context) {
//   const { params } = context;

//   const filterData = params.slug;

//   const filteredYear = filterData[0];
//   const filteredMonth = filterData[1];

//   const numYear = +filteredYear;
//   const numMonth = +filteredMonth;

//   if (isNaN(numYear) || isNaN(numMonth) || numYear < 2021 || numMonth > 12) {
//     return {
//       props: { hasError: true }
//       // notFound: true,
//       // redirect: {
//       //   destination: '/error'
//       // }
//     };
//   }

//   const filteredEvents = await getFilteredEvents({
//     year: numYear,
//     month: numMonth
//   });

//   return {
//     props: {
//       events: filteredEvents,
//       date: {
//         year: numYear,
//         month: numMonth
//       }
//     }
//   };
// }

export default FilteredEventsPage;