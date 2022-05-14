import GenderFilter from './GenderFilter';

const SelectedMovie = ({selectedMovie, sortBy, selectedMovieCharatersTotalHeight, selectedMovieCharaters, formatHeight, onGenderSelected}) => {
    return(
        
        <div className='selectedMovie'>
            <h1>{selectedMovie.title}</h1>
            <marquee>{selectedMovie.opening_crawl.replace(/\s+/g, ' ').trim()}</marquee>
            <div className='row rightRow gutter'>
                Filter gender: <GenderFilter onGenderSelected={onGenderSelected}/>
            </div>
            <table className='charactersTable'>
                <thead>
                <tr>
                    <th className="nameCol">
                        <span className="colHeader" onClick={() => sortBy('name')}>Names</span>
                    </th>
                    <th className='centerText'>
                        <span className="colHeader" onClick={() => sortBy('gender')}>Gender</span>
                    </th>
                    <th className='rightText'>
                        <span className="colHeader" onClick={() => sortBy('height')}>Height</span>
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    selectedMovieCharaters.map((character, i) => {
                    return  <tr key={i}>
                                <td>{character.name}</td>
                                <td className='centerText'>
                                {
                                    character.gender === 'male' && <span>M</span>
                                }
                                {
                                    character.gender === 'female' && <span>F</span>
                                }
                                {
                                    character.gender === 'hermaphrodite' && <span>M/F</span>
                                }
                                {
                                    character.gender === 'n/a' && <span>N/A</span>
                                }
                                </td>
                                <td className='rightText'>{character.height}</td>
                            </tr>
                    })
                }
                <tr className='summaryRow'>
                    <td className='summary'>Characters:<br/><b>{selectedMovieCharaters.length}</b> </td>
                    <td className='summary'></td>
                    <td className='rightText summary'>Total Height:<br/> <b>{formatHeight(selectedMovieCharatersTotalHeight)}</b></td>
                </tr>
                </tbody>
            </table>          
        </div>
    )
}

export default SelectedMovie;