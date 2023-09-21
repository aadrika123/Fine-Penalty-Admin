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
          <div className='w-screen h-screen flex justify-center items-center'>
            <div className='w-2/3 h-60 bg-white mx-auto my-auto text-center flex justify-center items-center shadow-xl'>
              <div>
                <h1 className='text-red-600 text-2xl font-semibold'>{this.props?.errorMsg}</h1>
                <div className='flex gap-2 items-center justify-center'>
                  <button onClick={() => window.history.back()} className="cypress_next1_button px-6 py-2.5 bg-indigo-500 text-white font-medium text-xs leading-tight  rounded  hover:bg-indigo-700 hover:shadow-lg focus:bg-indigo-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out mt-5">Go Back</button>
                  <button onClick={() => window.location.reload()} className="cypress_next1_button px-6 py-2.5 bg-indigo-500 text-white font-medium text-xs leading-tight  rounded  hover:bg-indigo-700 hover:shadow-lg focus:bg-indigo-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out mt-5">Reload</button>
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
