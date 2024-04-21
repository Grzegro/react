import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import './list.css';
import ElementListy from './elementListy.js';
import Calendar from './calendar.js';

function App() {
  const [savedLists, setSavedLists] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [title, setTitle] = useState(""); 

  const getSavedLists = () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith("Lista "));
    const lists = keys.map(key => JSON.parse(localStorage.getItem(key)));
    setSavedLists(lists);
  };

  const location = useLocation();

  useEffect(() => {
    // Perform your code when the route changes
    getSavedLists();

    // Add your code here to execute when the route changes
  }, [location.pathname]);

  

  useEffect(() => {
    getSavedLists();

  }, []);


  const updateTitle = (event) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
  };

  const consoleLogList = () => {
    console.log(currentList);
    console.log(currentList.length);
  };

  const generateUniqueId = () => {
    let random;
    let isUnique = false;
  
    do {
      random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      isUnique = true;
  
      for (let i = 0; i < savedLists.length; i++) {
        if (savedLists[i].id === random) {
          isUnique = false;
          break;
        }
      }
    } while (!isUnique);
  
    return random;
  };
  
  const createList = () => {
    if (title === '') {
      return;
    } else if(title.length < 3 || title.length > 20){
      const txt = document.getElementById("wrong-title");
      txt.innerHTML = "Tytuł musi mieć od 3 do 20 znaków.";
      return;
    }
    
    const id = generateUniqueId();
    
    const lista = {
      id: id,
      title: title,
      elements: []
    };
    
    setCurrentList(lista);

    for (let i = 0; i < savedLists.length; i++) {
      const indexOfList = i + 1;
      const element = localStorage.getItem("Lista " + indexOfList);
      const listObj = JSON.parse(element);
      if (listObj.title === title) {
        alert("Lista z tytułem: " + title + " już istnieje. Wybierz inny tytuł");
        return;
      }
    }
    
    localStorage.setItem("Lista " + (savedLists.length + 1), JSON.stringify(lista));
    getSavedLists();
    setTitle("");
    const txt = document.getElementById("wrong-title");
    txt.innerHTML = "";
  };

  const getAndSetList = ( list ) => {
    getSavedLists();
    setCurrentList(list);
  };



  
  

  return (
    <div>
      <nav className="navbar">
        <h1 className=''></h1>
      </nav>
      <div className="sidebar">
      <h2 className="calendar-title">Kalendarz</h2>
          <Link to="/calendar">
          <button className="calendar-button" onClick={() => setCurrentList([])}>Idź do kalendarza</button>
          </Link>
        <hr></hr>
        <h2 className="saved-lists">Twoje listy</h2>
        <ul className="list-menu">
          {savedLists.map((list, index) => (
            <li className="sidebar-list" key={index}>
              <Link to="lista">
              <button className="list-button" onClick={() => getAndSetList(list)}>{list.title}</button>
              </Link>
            </li>
          ))}
          
          <Link to="/">
          <button className="new-list-button" onClick={() => setCurrentList([])}>Dodaj nową listę</button>
          </Link>
        
        </ul>
      </div>
      <div className="main-container">
        <Routes>
        <Route path="/" element={(
            <div>
              <p>Tytuł: </p>
              <input
                type="text"
                value={title}
                onChange={updateTitle}
                placeholder="Wprowadź nazwę listy"
              />
              <p id="wrong-title"></p>
              <button onClick={createList}>Stwórz listę</button>
            </div>
          ) 
        } />
        <Route path="/lista" element={
            currentList.length === 0 ? (
              <p>Nie wybrano żadnej listy. Wybierz listę z paska bocznego lub utwórz nową.</p>
            ) : (
              
              <ElementListy key={currentList.id}  id={currentList.id} title={currentList.title} elements={currentList.elements} />
            )
          } />
            
          <Route path="/calendar" element={<Calendar lists={savedLists}></Calendar>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;