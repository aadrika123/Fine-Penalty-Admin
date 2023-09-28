import React from 'react'
class CustomErrorBoundaryForRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };

  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }


  // componentDidCatch(error, errorInfo) {
  //   // You can also log the error to an error reporting service
  //   logErrorToMyService(error, errorInfo);
  // }



  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <div className='w-screen h-screen flex justify-center items-center bg-orange-100'>
            <div className='md:w-2/3 w-full mx-6 md:h-60 h-auto md:py-0 py-8 md:px-0 px-2 bg-red-50 my-auto text-center flex justify-center items-center drop-shadow-md shadow-red-200 border border-red-400'>
              <div>
                <h1 className='text-red-500 text-xl md:text-2xl font-semibold'>😔 {this.props?.errorMsg} 😔</h1>
                <div className='flex gap-2 flex-wrap items-center justify-center mt-4'>
                  <button onClick={() => (window.history.back(), window.location.reload())} className="border text-sm border-amber-700 text-amber-700 px-3 py-1 rounded-sm shadow-md hover:shadow-xl hover:bg-amber-700 
                        hover:text-white ">Go Back</button>
                        <button onClick={() => (window.localStorage.clear(), window.location.replace('/fines'))} className="border text-sm border-red-500 text-red-500 px-3 py-1 rounded-sm shadow-md hover:shadow-xl hover:bg-red-500 
                        hover:text-white ">Log Out</button>
                  <button onClick={() => window.location.reload()} className="border text-sm border-blue-700 text-blue-700 px-3 py-1 rounded-sm shadow-md hover:shadow-xl hover:bg-blue-700 
                        hover:text-white ">Reload</button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}
export default CustomErrorBoundaryForRoutes
