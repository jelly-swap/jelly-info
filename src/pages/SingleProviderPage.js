import React from 'react';
import { useParams } from 'react-router-dom';
import { useProvider, useProviders } from '../contexts/Providers';

function SingleProviderPage() {
  const params = useParams()
  const provider = useProvider(params.provider)

  console.log(provider)

  return (
    <div></div>
  )
}

export default SingleProviderPage;

