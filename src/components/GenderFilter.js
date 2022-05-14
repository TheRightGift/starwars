 const GenderFilter = ({onGenderSelected}) => {

    return (
        <select className='select smSelect yellow' onChange={onGenderSelected}>
            <option value={'All'}>All Genders</option>
            <option value={'male'}>Male</option>
            <option value={'female'}>Female</option>
            <option value={'hermaphrodite'}>Hermaphrodite</option>
            <option value={'n/a'}>N/A</option>
        </select>
    )
 }

 export default GenderFilter;