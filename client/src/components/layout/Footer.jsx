import React from 'react'

const Footer = () => {
    return (
        <div>
            <div className='container'>
                <h1>Footer</h1>
            </div> 
            <div className='text-center bg-[#032119]'>
                <p>© {new Date().getFullYear()} Cine+. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Footer
