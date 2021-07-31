import { Fragment } from 'react';

import { getEventById, getAllEvents } from "../../helpers/api-util";
import EventSummary from '../../components/event-detail/EventSummary';
import EventLogistics from '../../components/event-detail/EventLogistics';
import EventContent from '../../components/event-detail/EventContent';
import ErrorAlert from '../../components/ui/ErrorAlert';

const EventDetailPage = (props) => {

  // 動的なクエリプロパティへアクセス
  const event = props.selectedEvent;

  if(!event) {
    return (
      <ErrorAlert>
        <p>No event found!</p>
      </ErrorAlert>
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
  const eventId = context.params.eventId;

  const event = await getEventById(eventId);

  return {
    props: {
      selectedEvent: event
    }
  }
}

export async function getStaticPaths() {
  // DBのidをすべて抽出する必要がある
  const events = await getAllEvents();

  // DBからidを抽出し、配列としてpathsキーに渡す
  const paths = events.map(event => ({ params: {eventId: event.id }}));

  // returnはオブジェクトを返す必要があり、pathsキーを持ったオブジェクトでなければならない！
  return {
    paths: paths,
    // 本来はこの形だが動的でない
    // [
    //   { params: { eventId: 'e1' }}
    // ]
    fallback: false
    // falseにすると不明なIDでページを読み込もうとすると404ページが表示される
  }
}

export default EventDetailPage;