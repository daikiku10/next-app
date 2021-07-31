import { getFeaturedEvents } from "../helpers/api-util";
import EventList from "../components/events/EventList";

const HomePage = (props) => {

  return (
    <div>
      <EventList items={props.events} />
    </div>
  )
}

export async function getStaticProps(context) {
  const featuredEvents = await getFeaturedEvents();
  console.log('featuredEvents', featuredEvents)

  return {
    props: {
      events: featuredEvents
    }
  }
}

export default HomePage;