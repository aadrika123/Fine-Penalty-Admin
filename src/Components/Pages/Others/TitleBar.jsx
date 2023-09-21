import { useLocation } from "react-router-dom"
import { BiLeftArrowAlt } from 'react-icons/bi'
import { BsColumnsGap } from 'react-icons/bs'
import { useState } from 'react'
import useSetTitle from "../../Common/useSetTitle"

function TitleBar(props) {
    const routeLocation = useLocation()
    useSetTitle('Verification')

    const backFunction = () => {
        const currentURL = window.location.href;
        const referrerURL = document.referrer;
        if (currentURL !== referrerURL) {
          window.history.replaceState(null, null, ''); // Remove current URL from history
          window.history.back(); // Navigate back in history
        } else {
          // Do nothing if current URL is the same as referrer URL
          console.log('Already at the previous page.');
        }
      };

    

    if (routeLocation.pathname == '/' || routeLocation?.pathname == '/login' && routeLocation?.pathname == '/mobile-modules') {
        return
    }

    if (props?.titleBarVisibility === false) {
        return
    }

    return (
        <>
            <div className="flex flex-row  py-2 justify-center items-center pr-2 sm:pr-0 z-40">
                <div className="flex-1 flex pl-2 text-gray-700">
                    <span className="cursor-pointer hover:text-[#122031] text-[#1A4D8C]" onClick={backFunction}><BiLeftArrowAlt className="inline font-semibold" />Back</span>
                </div>
                <div className="flex justify-right items-center text-xl font-semibold text-[#1A4D8C]">
                    <BsColumnsGap className="inline mr-2" />{props?.titleText}
                </div>
            </div>
            <hr />
        </>
    )
}

export default TitleBar