import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios'

function ProvidersPage() {
  const [providersData, setProvidersData] = useState('');

  useEffect(() => {
    (async() => {
      try {
        const response = await axios.get('https://jelly-jam.herokuapp.com/api/v1/info/get');

        console.log(response.data)

        setProvidersData(response.data);
      } catch (error) {
        console.log('Error getting liquidity providers', error);
      }
     
    })();
  }, [])

  return (
    <div></div>
  )
}

export default withRouter(ProvidersPage)