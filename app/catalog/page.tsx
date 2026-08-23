import React, { Suspense } from "react";
import { CatalogPage } from "./components/CatalogPage";
import CatalogWrapper from "./components/CatalogWrapper/CatalogWrapper";
import CatalogSkeletonGrid from "./components/Skeleton/CatalogSkeletonGrid";

export default function page() {
  return (
    <div>
      <Suspense fallback={<CatalogSkeletonGrid />}>
        <CatalogWrapper />
      </Suspense>
    </div>
  );
}
