import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/App.css';
import SelectMovie from './components/SelectMovie';
import SelectedMovie from './components/SelectedMovie';


function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedMovieCharaters, setSelectedMovieCharaters] = useState(null);
  const [selectedMovieCharatersTotalHeight, setSelectedMovieCharatersTotalHeight] = useState(0);
  const [characters, setCharacters] = useState(null);
  const [sortByCol, setSortByCol] = useState('');
  const [sortDirection, setSortDirection] = useState('ASC');

  useEffect(() => {
    setIsLoading(true);
    axios.get(`https://swapi.dev/api/films`)
    .then(res => {
      let muvies = res.data.results;      
      muvies.sort(function (a, b) {
          return a.release_date > b.release_date;
      });
      
      setMovies(muvies);
      setIsLoading(false);
    })
    .catch(err => {
      setError(true);
      setErrorMsg('Error loading movies. Please check your network and try  again.');

      setTimeout(() => {
        setIsLoading(false);
        setError(false);
        setErrorMsg('');
      }, 4000);
    })
  }, []);

  let onGenderSelected = (e) => {
    let gender = e.target.value;
    let characterByGender;
    
    if(gender === 'All'){
      characterByGender = characters;
    } else {
      characterByGender = characters.filter((character) => {
        return character.gender === gender;
      });
    }

    // recompute height
    let totalHeight = 0;
    if(characterByGender.length < 1){
      setSelectedMovieCharatersTotalHeight(0)
    }

    characterByGender.forEach(character => {
      if(character.height !== 'unknown'){
        totalHeight += parseInt(character.height);
        setSelectedMovieCharatersTotalHeight(totalHeight)
      }
    });

    // render characters
    setSelectedMovieCharaters(characterByGender);
  }

  let onMovieSelected = (e) => {
    setIsLoading(true);
    let episode_id = parseInt(e.target.value);

    let selectedMuvi = movies.filter((movie) => {
      return movie.episode_id === episode_id;
    });
    setSelectedMovie(selectedMuvi[0]);

    let selectedMovie = selectedMuvi[0], movieCharacters = [], totalHeight = 0;
    selectedMovie.characters.map(async (character, index) => {
      await axios.get(`${character}`)
      .then(res => {
        
        if(res.status === 200){
          let tempObj = {};
          tempObj.name = res.data.name;
          tempObj.gender = res.data.gender;
          tempObj.height = res.data.height;
          movieCharacters.push(tempObj);


          if(res.data.height !== 'unknown'){
            totalHeight += parseInt(res.data.height);
            setSelectedMovieCharatersTotalHeight(totalHeight)
          }
        }
        setIsLoading(false);
      })
      .catch(err => {
        setError(true);
        setErrorMsg('Error loading movie charaters. Please check your network and try again.');

        setTimeout(() => {
          setIsLoading(false);
          setError(false);
          setErrorMsg('');
        }, 4000);
      });
    });
    
    setSelectedMovieCharaters(movieCharacters);
    setCharacters(movieCharacters);
    
  }

  let sortBy = (col) => {
    let sortedCharacters;
    if(sortByCol === col){
      //sort by opposite direction
      if(sortDirection === 'ASC'){
        sortedCharacters = [...selectedMovieCharaters].sort((a,b) => (b[col] > a[col]) ? 1 : ((a[col] > b[col]) ? -1 : 0))
        setSortDirection('DESC');
      } else {
        sortedCharacters = [...selectedMovieCharaters].sort((a,b) => (a[col] > b[col]) ? 1 : ((b[col] > a[col]) ? -1 : 0));
        setSortDirection('ASC')
      }
      
    } else {
      //sort by ASC
      sortedCharacters = [...selectedMovieCharaters].sort((a,b) => (a[col] > b[col]) ? 1 : ((b[col] > a[col]) ? -1 : 0));
      setSortByCol(col);
    }
    setSelectedMovieCharaters(sortedCharacters);
    
  }

  let getRightPart = (num) => {
    if (Number.isInteger(num)) {
      return 0;
    }
  
    const decimalStr = num.toString().split('.')[1];
    return Number(decimalStr);
  }

  let getLeftPart = (num) => {
    if (Number.isInteger(num)) {
      return 0;
    }
  
    const decimalStr = num.toString().split('.')[0];
    return Number(decimalStr);
  }

  let formatHeight = (cm) => {
    let ft = cm / 30.48;
    
    let decimals = parseFloat(`0.${getRightPart(ft)}`);
    let inch = decimals * 12;
    inch = Math.round((inch + Number.EPSILON) * 100) / 100;

    return `${cm}cm (${getLeftPart(ft)}ft/${inch}in)`
  }
  
  return (    
    <div className="App">
      {
        isLoading && 
        <div className='row loaderRow'>
          <div className="loader"></div>
        </div>
      }
      {
        error && 
        <div className='error'>
          <p>{errorMsg}</p>
        </div>
      }      
      {
        selectedMovie != null && selectedMovieCharaters.length > 0 &&
        <SelectedMovie selectedMovie={selectedMovie} sortBy={sortBy} selectedMovieCharatersTotalHeight={selectedMovieCharatersTotalHeight} selectedMovieCharaters={selectedMovieCharaters} formatHeight={formatHeight} onGenderSelected={onGenderSelected}/>
      }       
      <div className='row movieSelectRow bottom'>
        <SelectMovie movies={movies} onMovieSelected={onMovieSelected}/>
      </div>
    </div>
  );
}

export default App;
