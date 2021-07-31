import { Fragment } from 'react';

import { getEventById, getFeaturedEvents } from "../../helpers/api-util";
import EventSummary from '../../components/event-detail/EventSummary';
import EventLogistics from '../../components/event-detail/EventLogistics';
import EventContent from '../../components/event-detail/EventContent';
import ErrorAlert from '../../components/ui/ErrorAlert';

const EventDetailPage = (props) => {

  // 動的なクエリプロパティへアクセス
  const event = props.selectedEvent;

  if(!event) {
    return (
      <div className="center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <Fragment>
      <EventSummary title={event.title} />
      <EventLogistics date={event.date} address={event.location} image={event.image} imageAlt={event.title} />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </Fragment>
  )
}

export async function getStaticProps(context) {
  console.log('[eventId].jsのgetStaticProps実行');
  const eventId = context.params.eventId;

  const event = await getEventById(eventId);

  return {
    props: {
      selectedEvent: event
    },
    revalidate: 30
  }
}

export async function getStaticPaths() {
  console.log('[eventId].jsのgetStaticPaths実行');
  // DBのidをすべて抽出する必要がある
  const events = await getFeaturedEvents();

  // DBからidを抽出し、配列としてpathsキーに渡す
  const paths = events.map(event => ({ params: {eventId: event.id }}));

  // returnはオブジェクトを返す必要があり、pathsキーを持ったオブジェクトでなければならない！
  return {
    paths: paths,
    // 本来はこの形だが動的でない
    // [
    //   { params: { eventId: 'e1' }}
    // ]
    fallback: 'blocking'
    // falseにすると不明なIDでページを読み込もうとすると404ページが表示される
  }
}

export default EventDetailPage;