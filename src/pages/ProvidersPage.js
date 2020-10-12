import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import LocalLoader from '../components/LocalLoader';

function ProvidersPage() {
  const [providersData, setProvidersData] = useState();

  useEffect(() => {
    (async() => {
      try {
        const response = await axios.get('https://jelly-jam.herokuapp.com/api/v1/info/get');

        setProvidersData(response.data);
      } catch (error) {
        console.log('Error getting liquidity providers', error);
      }
     
    })();
  }, [])

  if(!providersData) {
    return <LocalLoader fill="true"  />
  }

  return (
    <div></div>
  )
}

export default ProvidersPage