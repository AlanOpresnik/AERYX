import type { Metadata } from 'next'
import ProductEditor from './components/ProductEditor/ProductEditor'

export const metadata: Metadata = {
  title: 'Nuevo producto — Aeryx',
  description: 'Carga un nuevo producto al catálogo de Aeryx.',
}

export default function NewProductPage() {
  return <ProductEditor />
}
