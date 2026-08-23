import { api } from '@/lib/api/api'
import React from 'react'
import { CatalogPage } from '../CatalogPage'

export default async function CatalogWrapper() {
    const products = await api.products.getAll()

    if(!products) {
        return (
            <p>No se encontraron productos en este momento</p>
        )
    }

  return (
    <div>
        <CatalogPage products={products} />
    </div>
  )
}
