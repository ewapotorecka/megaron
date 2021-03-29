import React, { useEffect, useState } from 'react';
import { getCalendarEvents } from '../api-client';
import './index.css';

interface SummarizedDay {
	date: string,
	numberOfEvents: number,
	totalDuration: number,
	longestEvent: string,
	id: string
}

const CalendarSummary: React.FunctionComponent = () => {
	const currentDateString = new Date( Date.now() ).toString().slice( 0, 15 );
	const [ weekViewData, setWeekViewData ] = useState< SummarizedDay[] | [] >( [] );

	useEffect( () => {
		const calendarDataPromiseArray = [];

		for ( let i = 0; i < 7; i++ ) {
			const date = new Date();

			date.setDate( new Date( Date.parse(currentDateString) ).getDate() + i );
			calendarDataPromiseArray.push(getCalendarEvents( date ));
		}

		Promise.all( calendarDataPromiseArray )
			.then( result => {
				const summarizedCalendarData = [];
				let summarizedWeekEventsDuration = 0;
				let summarizedWeekEventsNumber = 0;
				let longestEventDurationInTheWeek = 0;
				let longestEventInTheWeek = '';

				for ( let i = 0; i < 7; i++ ) {
					let totalDuration = 0;
					let longestEventDuration = 0;
					let longestEvent = '';
					const date = new Date();

					date.setDate( new Date( Date.parse( currentDateString )).getDate() + i );

					const dateString = `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}` }-${date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`}`;

					for ( const event of result[ i ] ) {
						totalDuration+= event.durationInMinutes;
						summarizedWeekEventsDuration+= event.durationInMinutes;
						summarizedWeekEventsNumber++;

						if ( event.durationInMinutes > longestEventDuration ) {
							longestEventDuration = event.durationInMinutes;
							longestEvent = event.title;
						}

						if ( event.durationInMinutes > longestEventDurationInTheWeek ) {
							longestEventDurationInTheWeek = event.durationInMinutes;
							longestEventInTheWeek = event.title;
						}
					}

					const summarizedDay = {
						date: dateString,
						numberOfEvents: result[ i ].length,
						totalDuration,
						longestEvent,
						id: ( ( Math.random() * 0xFFFFFFFF ) | 0 ).toString( 36 )
					};

					summarizedCalendarData.push( summarizedDay );
				}

				const summarizedWeek = {
					date: 'Total',
					numberOfEvents: summarizedWeekEventsNumber,
					totalDuration: summarizedWeekEventsDuration,
					longestEvent: longestEventInTheWeek,
					id: ( ( Math.random() * 0xFFFFFFFF ) | 0 ).toString( 36 )
				};
				summarizedCalendarData.push( summarizedWeek );
				setWeekViewData( summarizedCalendarData );
			} )
	}, [ currentDateString ] );

  return (
    <div className='calendar'>
      <h2 className='calendar-header'>Calendar summary</h2>
	  <table className='table'>
		  <thead className='table-header'>
			  <tr>
				<th className='table-header-element'>Date</th>
				<th>Number of events</th>
				<th>Total duration [min]</th>
				<th>Longest event</th>
			  </tr>
		  </thead>
		  <tbody>
		  { weekViewData.map( (element: SummarizedDay )=> {
			 return(
				 <tr key={element.id}>
					 <td className='table-element-align-left'>{element.date}</td>
					 <td>{element.numberOfEvents}</td>
					 <td>{element.totalDuration}</td>
					 <td className='table-element-align-left'>{element.longestEvent}</td>
				 </tr>
			 )
		 })}
		  </tbody>
	  </table>
    </div>
  );
};

export default CalendarSummary;

