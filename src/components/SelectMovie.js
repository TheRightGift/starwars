const SelectMovie = ({movies, onMovieSelected}) => {
    return(
      <select className='select yellow' onChange={onMovieSelected}>
        <option value="_">Choose a star wars Movie</option>
        { 
          movies.map(element => {
            return <option value={element.episode_id} key={element.episode_id}>{element.title}</option>
          }) 
        }
      </select>
    )
}

export default SelectMovie;