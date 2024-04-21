import React, { useState } from 'react';
import './Calendar.css';

const daysOfWeek = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];

const Calendar = ({ lists }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  //pobierz ilość dni w miesiącu
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  //pobierz pierwszy dzień miesiąca
  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  //generowanie danie w kalendarzu
  const generateCalendar = () => {
    const totalDaysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const calendar = [];

    // Dni z poprzedniego miesiąca
    for (let i = prevMonthDays - firstDayOfMonth + 2; i <= prevMonthDays; i++) {
      calendar.push({
        day: i,
        month: currentDate.getMonth() - 1,
        isCurrentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, i)
      });
    }

    // Dni z tego mieśiąca
    for (let i = 1; i <= totalDaysInMonth; i++) {
      calendar.push({
        day: i,
        month: currentDate.getMonth() + 1,
        isCurrentMonth: true,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      });
    }

    // Dni z następnego miesiąca
    const totalDaysDisplayed = Math.ceil((calendar.length + firstDayOfMonth) / 7) * 7;
    let nextMonthDay = 1;
    while (calendar.length < totalDaysDisplayed) {
      calendar.push({
        day: nextMonthDay,
        month: currentDate.getMonth() + 2,
        isCurrentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, nextMonthDay)
      });
      nextMonthDay++;
    }

    return calendar;
  };

  //zapisywanie zmienej na podstawie wybranego przez użytkownika dnia
  const handleDayClick = (day) => {
    setSelectedDate(day);
  };


  //pobieranie zaplanowanych zadań z wybranego dnia
  const filterElements = (selectedDate) => {
    const filteredElements = lists.map((list) => {
      const dueElements = list.elements.filter((element) => {
        const elementDate = new Date(element.due_date);
        return (
          elementDate.getDate() === selectedDate.date.getDate() &&
          elementDate.getMonth() === selectedDate.date.getMonth() &&
          elementDate.getFullYear() === selectedDate.date.getFullYear()
        );
      });
      return dueElements.length > 0 ? { title: list.title, elements: dueElements } : null;
    }).filter(item => item !== null);
    return filteredElements;
  };

  //tworzenie kalendarza
  const renderCalendar = () => {
    const calendar = generateCalendar();
    return calendar.map((day, index) => {
      let dayClassName = `calendar-day ${day.isCurrentMonth ? '' : 'other-month'} ${hasPlannedEvents(day.date) ? 'planned-event' : ''}`;
      return (
        <div
          key={index}
          className={dayClassName}
          onClick={() => handleDayClick(day)}
        >
          {day.date.getDate()}
        </div>
      );
    });
  };


  const hasPlannedEvents = (date) => {
    return lists.some(list => {
      return list.elements.some(element => {
        const elementDate = new Date(element.due_date);
        return (
          elementDate.getDate() === date.getDate() &&
          elementDate.getMonth() === date.getMonth() &&
          elementDate.getFullYear() === date.getFullYear()
        );
      });
    });
  };

  // zamknięcie okna z informacjami czy w wybranym przez użytkownika dniu są zaplanowane zadania
  const closeModal = () => {
    setSelectedDate(null);
  };


  //wyświetlanie czy w wybranym przez użytkownika dniu jest zaplanowane jakieś zadanie
  const Modal = ({ date }) => {
    
    const filteredElements = filterElements(date);
  
    const day = date.date.getDate();
    const month = date.date.toLocaleString('default', { month: 'long' });
    const year = date.date.getFullYear();

    return (
      <div className="modal-calendar">
        <div className="modal-content-calendar">
          <span className="close" onClick={closeModal}>&times;</span>
          <p className='date-info'>{day} {month} {year}</p>
          {filteredElements.length > 0 && (
            <div className="modal-list-container">
              {filteredElements.map((filteredList, index) => (
                <div key={index} className="list-group">
                  <h3 className='modal-lemist-title'>{filteredList.title}</h3>
                  <ul className='modal-elent-container'>
                    {filteredList.elements.map((element, elementIndex) => (
                      <li className='modal-list-element' key={elementIndex}>{element.description}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {filteredElements.length === 0 && <p>Brak zadań zaplanowanych na wybrany dzień</p>}
        </div>
      </div>
    );
  };

  //wyświetlanie strony
  return (
    
    <div className="calendar">
      
      {selectedDate && <Modal date={selectedDate} />}
      <div className="calendar-header">
        
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
          &lt;
        </button>
        <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
          &gt;
        </button>
      </div>
      <div className="days-of-week">
        {daysOfWeek.map((day) => (
          <div key={day} className="day-of-week">
            {day}
          </div>
        ))}
      </div>
      <div className="days-grid">{renderCalendar()}</div>
    </div>
  );
};

export default Calendar;
