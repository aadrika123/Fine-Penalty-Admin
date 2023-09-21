import React from 'react'
import './shimmer.css'

function ShimmerCard() {
    return (
        <div className="w-screen rounded-md flex flex-row gap-2 flex-wrap">
            <div className="h-[150px] w-[150px]  rounded-t-md object-cover bg-gray-200 animate">
            </div>
            <div className="h-[150px] w-[150px]  rounded-t-md object-cover bg-gray-200 animate">
            </div>
            <div className="h-[150px] w-[150px] rounded-t-md object-cover bg-gray-200 animate">
            </div>
            <div className="h-[150px] w-[150px] rounded-t-md object-cover bg-gray-200 animate">
            </div>
        </div>
    )
}

export default ShimmerCard