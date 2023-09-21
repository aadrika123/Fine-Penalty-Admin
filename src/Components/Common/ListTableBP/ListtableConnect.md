    const [requestBody, setrequestBody] = useState(null) // create this to store your payload data
    const [changeData, setchangeData] = useState(0) // create this to notify ListTableConnect component that payload has changed
    const [dataList , setdataList] = useState(null) // to store data coming from api response
    
    onSubmit: (values) => {

            // set request body for list table connect
            setrequestBody({
                wardMstrId: formik.values.wardMstrId,
                year: formik.values.year
            })

            // set change data to hit again api with new payload for list table connect
            setchangeData(prev => prev + 1)
        }

            {
                (requestBody != null) &&
                <ListTableConnect
                    getData={true} // send true if you want to get data from response after that you will get response data from 'allData' key or you can leave it
                    allData={(data) => setdataList(data)} // here you store your data in your variable or you can leave it
                    api={your_api} // sending api
                    columns={your_column} // sending column
                    requestBody={requestBody} // sending payload
                    changeData={changeData} // send to notify component that payload has changed
                />
            }