///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : ListTableConnect
// 👉 Status      : Closed
// 👉 Description : Component to manage backend pagination proccess
// 👉 Functions   :  
//                  1. searchOldFun  -> Search Data with payload  
//                  2. nextPageFun   -> To move on next page
//                  3. prevPageFun   -> To move on previous page
//                  4. perPageFun    -> To set no. of data in per page
//                  5. firstPageFun  -> To jump on first page
//                  6. lastPageFun   -> To jump on last page
//                  7. gotoPageFun   -> To jump of manual or any entered page
//                  8. exportDataFun -> To collect all data to export
//                  9. downloadFun   -> To download the exported data in CSV
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing packages 👈
import React, { useEffect, useState } from 'react'
import ListTable2 from './ListTable2v2'
import ApiHeader from '@/Components/api/ApiHeader'
import { CSVDownload } from 'react-csv'
import axios from 'axios'
import ShimmerEffectInline from '@/Components/Common/Loaders/ShimmerEffectInline'

const ListTableConnect = (props) => {

    // 👉 State constants 👈
    const [perPageCount , setperPageCount] = useState(10)
    const [pageCount    , setpageCount]    = useState(1)
    const [currentPage  , setcurrentPage]  = useState(0)
    const [lastPage     , setlastPage]     = useState(0)
    const [totalCount   , settotalCount]   = useState(0)
    const [exportData   , setexportData]   = useState()
    const [csvStatus    , setcsvStatus]    = useState(false)
    const [errorState   , seterrorState]   = useState(false)
    const [dataList     , setdataList]     = useState([])
    const [loader       , setloader]       = useState(false)

    // 👉 Function 1 👈
    const searchOldFun = () => {

        seterrorState(false)

        setloader(true)

        if (Object.keys(props?.requestBody).length !== 0) {
            props.loader(true)
        }

        console.log(`data before hitting api (${props?.api}) => `, { ...props?.requestBody, perPage: perPageCount, page: pageCount })

        axios.post(
            props?.api, { ...props?.requestBody, perPage: perPageCount, page: pageCount }, ApiHeader())
            .then((res) => {
                if (res?.data?.status == true) {
                    console.log('search success => ', res)
                    props?.getData && props?.allData(res?.data?.data)
                    setdataList(res?.data?.data?.data)
                    settotalCount(res?.data?.data?.total)
                    setcurrentPage(res?.data?.data?.current_page)
                    setlastPage(res?.data?.data?.last_page)
                    seterrorState(false)
                } else {
                    console.log('error while search => ', res)
                    seterrorState(true)
                }

            })
            .catch((err) => (console.log('error while search => ', err), seterrorState(true)))
            .finally(() => {
                setloader(false)
                if (Object.keys(props?.requestBody).length !== 0) {
                    props.loader(false)
                }
                seterrorState(false)
            })

    }

    // 👉 Function 2 👈
    const nextPageFun = () => {
        setpageCount(currentPage + 1)
    }

    // 👉 Function 3 👈
    const prevPageFun = () => {
        setpageCount(currentPage - 1)
    }

    // 👉 Function 4 👈
    const perPageFun = (val) => {

        let checkPage = parseInt(totalCount / val)
        let checkPageRemainder = parseInt(totalCount % val)

        // console.log("total count => ", totalCount,
        // "\n Per page => ", val,
        // "\n checkPage => ", checkPage,
        // "\n check page remainder => ", checkPageRemainder)

        if (checkPageRemainder == 0) {
            checkPage < currentPage && setpageCount(checkPage)
            setperPageCount(val)
            return
        }

        if (checkPageRemainder != 0) {
            (checkPage + 1) < currentPage && setpageCount(checkPage + 1)
            setperPageCount(val)
            return
        }

        // setperPageCount(val)
    }

    // 👉 Function 5 👈
    const firstPageFun = () => {
        setpageCount(1)
    }

    // 👉 Function 6 👈
    const lastPageFun = () => {
        setpageCount(lastPage)
    }

    // 👉 Function 7 👈
    const gotoPageFun = (val) => {
        setpageCount(val)
    }

    // 👉 Function 8 👈
    const exportDataFun = () => {

        setloader(true)
        setcsvStatus(false)

        axios.post(
            props?.api, { ...props?.requestBody, perPage: totalCount }, ApiHeader())
            .then((res) => {
                if (res?.data?.status == true) {
                    setexportData(res?.data?.data?.data)
                    downloadFun()
                } else {
                }

                setloader(false)
            })
            .catch((err) => {
                setloader(false)
            })

    }

    // 👉 Function 9 👈
    const downloadFun = () => {
        setcsvStatus(true)
    }

    // 👉 Calling Function 1 on Data change 👈
    useEffect(() => {

        if (props?.requestBody != null) {
            setpageCount(1)
            setperPageCount(10)
            searchOldFun()
        }
    }, [props?.changeData])

    // 👉 Calling Function 1 when page no. or data per page change 👈
    useEffect(() => {
        setloader(true)
        searchOldFun()
    }, [pageCount, perPageCount])

    return (
        <>

            {/* 👉 When error occured 👈 */}
            {errorState &&
                <div className="bg-red-100 border border-red-400 text-red-700 pl-4 pr-16 py-3 rounded relative text-center" role="alert">
                    <strong className="font-bold">Sorry! </strong>
                    <span className="block sm:inline">Some error occured while fetching list. Please try again later.</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    </span>
                </div>
            }

            {/* 👉 Download CSV 👈 */}
            {
                csvStatus && <CSVDownload data={exportData} />
            }

            {/* 👉 Loader 👈 */}
            {
                loader && <ShimmerEffectInline />
            }

            {/* 👉 Listtable Components 👈 */}
            {
                (!loader && dataList?.length > 0) ?

                    <>
                            {/* 👉 Listtable 👈 */}
                            <ListTable2 search={props?.search} currentPage={currentPage} lastPage={lastPage} goFirst={firstPageFun} goLast={lastPageFun} count1={totalCount} columns={props?.columns} dataList={dataList} exportStatus={true} perPage={perPageCount} perPageC={perPageFun} totalCount={totalCount} nextPage={nextPageFun} prevPage={prevPageFun} exportDataF={exportDataFun} exportData={exportData} gotoPage={(val) => gotoPageFun(val)} />
                    </>

                    :

                    // 👉 When no data available 👈
                    <>{(!loader) &&
                        <div className="bg-red-100 border border-red-400 text-red-700 pl-4 pr-16 py-3 rounded relative text-center" role="alert">
                            <span className="block sm:inline">Oops! No data available.</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            </span>
                        </div>}</>

            }

        </>
    )
}

export default ListTableConnect