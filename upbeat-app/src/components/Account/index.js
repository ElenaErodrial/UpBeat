import React from 'react'
// import { retrieveMusician } from '../../logic/'
import { Link } from 'react-router-dom'

export default function ({ user }) {


    const { username, description, rol, format, email, image, links, upcomings, location} = user
   


    return <>{user && <section className="profile account">
        <div className="profile__header">
            <h2 className='profile__username'>{username}</h2>
            <p className='profile__position'>{(rol === "solo") ? format.instruments.join() : format.groups}</p>
        </div>
        <div className="location-container">
            <i className="fas fa-map-marker-alt"></i>
            <p className="profile__ubication">{location}</p>
        </div>
        <div className="user-content">
            <div className="image-container">
            { rol === "solo" && <img className="user-content__img" src={image ? image : "images/default/solo.jpg"}/>}
            { rol === "groups" && <img className="user-content__img" src={image ? image : "images/default/groups.jpg"}/>}
            </div>
            <p className="user-content__description">{description}</p>
            
            {links && <><h2 className='user-content__subtitle'>More about me:</h2><a className="user-content__links"
                href={links} target="_blank"><i className="fas fa-link"></i></a></>} 
            <h2 className='user-content__subtitle'>Upcoming performances:</h2>
            <p className="user-content__activities">{upcomings}
            </p>       
        </div>
        <Link className="go-back" to="/"> Go back</Link>
    </section>}</>
}