import React from 'react'
import { CatalogPage } from '../CatalogPage'
import { getProducts } from '@/lib/api/server-api'

export default async function CatalogWrapper() {
    const products = await getProducts()
    
    if(!products || products.length === 0) {
        return (<p>No se encontraron productos en este momento</p>)
    }
    
  return (
    <div>
        <CatalogPage products={products} />
    </div>
  )
}
