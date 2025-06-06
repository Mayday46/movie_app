

const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        // Props are read only, so we cannot modify them directly.
        <div className = "search">
            <div>
                <img src = "./search.svg" alt = "Search" />
                <input
                    type = "text"
                    placeholder = "Search through thousands of movies..."
                    value = {searchTerm}
                    onChange = {(event) => setSearchTerm(event.target.value)}
                />
            </div>
        
        </div>
    )
}

export default Search;