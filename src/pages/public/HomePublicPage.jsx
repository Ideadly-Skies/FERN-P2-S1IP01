import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../configs/auth';

function HomePublicPage() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate();
  
  async function handlelogout() {
    
    try {
      const result = await signOut(auth);
      console.log(result);
      
      navigate("/auth/login");
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div>HomePublicPage</div>
      { !user && <button onClick={() => {navigate("/auth/login")}}>sign in</button>}
      { user &&  <button onClick={() => {handlelogout()}}>sign out</button>}
    </>
    
  )
}

export default HomePublicPage