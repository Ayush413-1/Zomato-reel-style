import React from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/bottom-nav.css'

const BottomNav = () => {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Bottom">

      <div className="bottom-nav__inner">

        {/* Home */}
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => 
            `bottom-nav__item ${isActive ? 'is-active' : ''}`
          }
        >
          <span className="bottom-nav__icon">

            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2">

              <path d="M3 10.5 12 3l9 7.5"/>
              <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/>

            </svg>

          </span>

          <span className="bottom-nav__label">
            Home
          </span>

        </NavLink>


        {/* Saved */}
        <NavLink 
          to="/saved" 
          className={({ isActive }) => 
            `bottom-nav__item ${isActive ? 'is-active' : ''}`
          }
        >

          <span className="bottom-nav__icon">

            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">

              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>

            </svg>

          </span>

          <span className="bottom-nav__label">
            Saved
          </span>

        </NavLink>


        {/* Profile */}
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `bottom-nav__item ${isActive ? 'is-active' : ''}`
          }
        >

          <span className="bottom-nav__icon">

            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >

              <circle cx="12" cy="7" r="4"/>

              <path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>

            </svg>

          </span>


          <span className="bottom-nav__label">
            Profile
          </span>

        </NavLink>


      </div>

    </nav>
  )
}

export default BottomNav