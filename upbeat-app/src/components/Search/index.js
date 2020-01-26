import React from 'react'
import { Link } from 'react-router-dom'

import Results from '../Results'

export default function ({ username, onSearch, results, onDetail, onToggleFavs }) {
    
    return <>
        <section className="search">
            <p className='greeting'>Hello, {username}! </p>
            <form className='searcher' onSubmit={event => {
                event.preventDefault();
                const { query: { value: query } } = event.target
                onSearch(query)
            }}>
                <input type="text" className='searcher__bar' name="query" placeholder="what are you looking for?" />
                <button className="searcher__button">Search</button>
            </form>
            <Results results={results} onDetail = {onDetail} onToggleFavs = {onToggleFavs}  />
        </section>
</>
}