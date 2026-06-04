import React from 'react'
import { notFound } from 'next/navigation';
import { getCarById } from '@/actions/car-listing';
import CarDetailPage from './_components/car-details';
export async function generateMetadata({ params }) {
  const { id } = await params;
  const result = await getCarById(id);

  if (!result.success) {
    return {
      title: "Car Not Found | DriveIQ",
      description: "The requested car could not be found",
    };
  }

  const car = result.data;

  return {
    title: `${car.year} ${car.make} ${car.model} | DriveIQ`,
    description: car.description.substring(0, 160),
    openGraph: {
      images: car.images?.[0] ? [car.images[0]] : [],
    },
  };
}

const Carpage = async ({params}) => {
    const { id } = await params;
    const result = await getCarById(id);

  // If car not found, show 404
  if (!result.success) {
    notFound();
  }
  return (
    <div>
      <CarDetailPage car={result.data} testDriveInfo={result.data.testDriveInfo} />
      </div>
  )
}

export default Carpage