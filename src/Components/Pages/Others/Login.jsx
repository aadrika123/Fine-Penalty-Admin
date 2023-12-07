import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import "./login.css";
import { RotatingLines } from "react-loader-spinner";
import ProjectApiList from "@/Components/api/ProjectApiList";
import ApiHeader from "@/Components/api/ApiHeader";
import img from "@/Components/assets/fp.png";
import AxiosInterceptors from "@/Components/Common/AxiosInterceptors";
import {
  getLocalStorageItem,
  setLocalStorageItem,
  setLocalStorageItemStrigified,
} from "@/Components/Common/localstorage";
import ulb_data from "@/Components/Common/DynamicData";
import {
  allowNumberInput,
  checkErrorMessage,
} from "@/Components/Common/PowerupFunctions";
import { contextVar } from "@/Components/context/contextVar";
import { RxCross2 } from "react-icons/rx";
import apk from "@/Components/assets/download.png";

const { api_login, api_getFreeMenuList } = ProjectApiList();

const validationSchema = Yup.object({
  username: Yup.string().required("Enter Username"),
  password: Yup.string().required("Enter Password"),
});

function Login() {
  const { setmenuList, setuserDetails, setheartBeatCounter } =
    useContext(contextVar);
  const [loaderStatus, setLoaderStatus] = useState(false);
  const [manualDialogStatus, setmanualDialogStatus] = useState(false);
  const userManualModalRef = useRef();

  const modalRef = useRef();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      authUser();
    },
    validationSchema,
  });

  const formik2 = useFormik({
    initialValues: {
      email: "",
      mobile: "",
    },
    onSubmit: (values) => {
      console.log(values);
      submitFun(values);
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().test(
        "email-or-mobile",
        "Please provide an email or mobile number",
        function (value) {
          const { mobile } = this.parent; // Access the 'mobile' field

          if (!value && !mobile) {
            return false; // Fail validation if both email and mobile are empty
          }

          return true; // Pass validation otherwise
        }
      ),
      mobile: Yup.string().test(
        "email-or-mobile",
        "Please provide an email or mobile number",
        function (value) {
          const { email } = this.parent; // Access the 'email' field

          if (!value && !email) {
            return false; // Fail validation if both email and mobile are empty
          }

          return true; // Pass validation otherwise
        }
      ),
    }),
  });

  const submitFun = (values) => {
    setLoaderStatus(true);
    let requestBody = {
      mobileNo: values?.mobile,
      email: values?.email,
    };
    console.log("--1--before reset send...", requestBody);
    axios
      .post("", requestBody, header)
      .then(function (response) {
        console.log("reset password response => ", response.data);
        // return
        if (response.data.status == true) {
          toast.success(response?.data?.message);
          modalRef.current.close();
          formik2.resetForm();
        } else {
          console.log("false...");
          setLoaderStatus(false);
          toast.error(response?.data?.message);
        }
      })
      .catch(function (error) {
        setLoaderStatus(false);
        console.log("reset password error => ", error);
        toast.error("Server Error");
      });
  };

  const navigate = useNavigate();

  useEffect(() => {
    getLocalStorageItem("token") != "null" &&
      getLocalStorageItem("token") != null &&
      navigate("/home");
  }, []);

  const labelStyle = "text-gray-800 text-sm";
  const inputStyle =
    "border focus:outline-none drop-shadow-sm focus:drop-shadow-md px-4 py-1 text-gray-700 shadow-black placeholder:text-sm";

  const header = {
    headers: {
      Accept: "application/json",
    },
  };

  //authUser function which authenticate user credentials
  const authUser = (e) => {
    setLoaderStatus(true);
    let requestBody = {
      email: formik.values.username,
      password: formik.values.password,
    };
    console.log("--1--before login send...", requestBody);
    AxiosInterceptors.post(api_login, requestBody, header)
      .then(function (response) {
        console.log("message check login ", response.data);
        // return
        if (response.data.status == true) {
          setLocalStorageItem("token", response?.data?.data?.token);
          setLocalStorageItemStrigified(
            "userDetails",
            response?.data?.data?.userDetails
          );

          if (response?.data?.data?.userDetails?.user_type == "ADMIN") {
            setLocalStorageItemStrigified("menuList", [
              { name: "Home", path: "/home", children: [] },
              { name: "Application List", path: "/fp-list", children: [] },
              { name: "Search Challan", path: "/search-challan", children: [] },
              { name: "Workflow", path: "/fp-workflow", children: [] },
              {
                name: "Violation Master",
                path: "/violation-master",
                children: [],
              },
              { name: "User Role Master", path: "/user-master", children: [] },
              {
                name: "Cash Verification",
                path: "/cash-verification",
                children: [],
              },
              {
                name: "Reports",
                path: "",
                children: [
                  {
                    name: "Challan Generated Report",
                    path: "/challan-generated-report",
                  },
                  {
                    name: "Violation Wise Report",
                    path: "/violation-wise-report",
                  },
                  { name: "Collection Report", path: "/collection-report" },
                  { name: "Comparision Report", path: "/comparision-report" },
                ],
              },
            ]);
          }

          if (response?.data?.data?.userDetails?.user_type == "CO") {
            setLocalStorageItemStrigified("menuList", [
              { name: "Home", path: "/home", children: [] },
              { name: "Application List", path: "/fp-list", children: [] },
              { name: "Search Challan", path: "/search-challan", children: [] },
              { name: "Workflow", path: "/fp-workflow", children: [] },
            ]);
          }
          if (response?.data?.data?.userDetails?.user_type == "EC") {
            setLocalStorageItemStrigified("menuList", [
              { name: "Home", path: "/home", children: [] },
              { name: "Application List", path: "/fp-list", children: [] },
              { name: "Search Challan", path: "/search-challan", children: [] },
              {
                name: "Violation Master",
                path: "/violation-master",
                children: [],
              },
              { name: "User Role Master", path: "/user-master", children: [] },
              {
                name: "Cash Verification",
                path: "/cash-verification",
                children: [],
              },
              {
                name: "Reports",
                path: "",
                children: [
                  {
                    name: "Challan Generated Report",
                    path: "/challan-generated-report",
                  },
                  {
                    name: "Violation Wise Report",
                    path: "/violation-wise-report",
                  },
                  { name: "Collection Report", path: "/collection-report" },
                  { name: "Comparision Report", path: "/comparision-report" },
                ],
              },
            ]);
          }
          if (response?.data?.data?.userDetails?.user_type == "JSK") {
            setLocalStorageItemStrigified("menuList", [
              { name: "Home", path: "/home", children: [] },
              { name: "Application List", path: "/fp-list", children: [] },
              { name: "Search Challan", path: "/search-challan", children: [] },
            ]);
          }

          fetchMenuList();
          setheartBeatCounter((prev) => prev + 1);
          navigate("/home"); //navigate to home page after login

          toast.success("Login Successfull");
        } else {
          console.log("false...");
          setLoaderStatus(false);
          toast.error(response?.data?.message);
        }
      })
      .catch(function (error) {
        setLoaderStatus(false);
        console.log("--2--login error...", error);
        toast.error("Server Error");
      });
  };

  // 3 CHANGE FOR SINGLE AUTH
  const fetchMenuList = () => {
    let requestBody = {
      moduleId: 10,
    };
    console.log("request body", requestBody);

    AxiosInterceptors.post(api_getFreeMenuList, requestBody, ApiHeader())
      .then(function (response) {
        console.log(
          "fetched menu list.....",
          response?.data?.data?.userDetails?.roles
        );
        // return
        if (response.data.status == true) {
          // setLocalStorageItemStrigified('menuList', response?.data?.data?.permission)
          // setLocalStorageItemStrigified('userDetails', response?.data?.data?.userDetails)

          setmenuList(response?.data?.data?.permission);
          setuserDetails(response?.data?.data?.userDetails);
        } else {
          console.log("false menu list => ", response?.data?.message);
          setLoaderStatus(false);
          seterrorMsg(checkErrorMessage(response.data.message));
        }
      })
      .catch(function (error) {
        setLoaderStatus(false);
        // seterroState(true)
        console.log("--2--login error...", error);
      });
  };

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    console.log("first", name);

    if (name == "email") {
      formik2.setFieldValue("mobile", "");
      formik2.setFieldValue("email", value);
    }

    if (name == "mobile") {
      formik2.setFieldValue("email", "");
      formik2.setFieldValue(
        "mobile",
        allowNumberInput(value, formik2?.values.mobile, 10)
      );
    }
  };

  {
    /* ═════════════║ THIS USEFFECT HANDLES THE DIALOG OPEN AND CLOSE ║══════════════════ */
  }
  useEffect(() => {
    if (manualDialogStatus) {
      if (!userManualModalRef.current.open) {
        userManualModalRef.current.showModal();
      }
    } else {
      if (userManualModalRef.current.open) {
        userManualModalRef.current.close();
      }
    }
  }, [manualDialogStatus]);

  return (
    <>
      {/* ═════════════║ USER MANUAL DIALOG ║══════════════════ */}
      <dialog ref={userManualModalRef} className="bg-transparent w-full">
        <div className="w-full md:w-2/3 mx-auto my-10 bg-white px-2 rounded-xl shadow shadow-slate-300 pt-7 relative min-h-[500px]">
          <div className="">
            <button
              onClick={() => setmanualDialogStatus(false)}
              type="button"
              className="absolute top-6 right-8 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center darks:hover:bg-gray-800 darks:hover:text-white"
            >
              <svg className="w-5 h-5" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <div className="bg-white ">
              <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl ">
                Download User Manual
              </h1>
              <div className="container p-10 mx-auto grid grid-cols-12 space-x-2">

                <div className="col-span-12 md:col-span-3 gap-4 mt-6 xl:mt-12 xl:gap-12 md:grid-cols-2 lg:grid-cols-3">
                  <div className="w-full p-8 space-y-8 text-center border border-gray-200 rounded-lg bg-gray-200">
                    <p className="font-medium text-gray-500 uppercase ">
                      Enforcement Officer App
                    </p>

                    <a href="./manual-enf-off.pdf" download>
                      <button className="w-full px-4 py-2 mt-10 tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                        Download
                      </button>
                    </a>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3 gap-4 mt-6 xl:mt-12 xl:gap-12 md:grid-cols-2 lg:grid-cols-3">
                  <div className="w-full p-8 space-y-8 text-center border border-gray-200 rounded-lg bg-gray-200">
                    <p className="font-medium text-gray-500 uppercase ">
                      Commitee Member Web
                    </p>
 <a href="./manual-enf-commitee.pdf" download>
                    <button className="w-full px-4 py-2 mt-10 tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                      Download
                    </button>
                    </a>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3 gap-4 mt-6 xl:mt-12 xl:gap-12 md:grid-cols-2 lg:grid-cols-3">
                  <div className="w-full p-8 space-y-8 text-center border border-gray-200 rounded-lg bg-gray-200">
                    <p className="font-medium text-gray-500 uppercase ">
                      Enforcement Cell Web
                    </p>
                    <a href="./manual-enf-cell.pdf" download>
                    <button className="w-full px-4 py-2 mt-10 tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                      Download
                    </button>
                    </a>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3 gap-4 mt-6 xl:mt-12 xl:gap-12 md:grid-cols-2 lg:grid-cols-3">
                  <div className="w-full p-8 space-y-8 text-center border border-gray-200 rounded-lg bg-gray-200">
                    <p className="font-medium text-gray-500 uppercase ">
                      JSK
                      <div>&nbsp;</div>
                    </p>
                    <a href="./manual-jsk.pdf" download>
                    <button className="w-full px-4 py-2 mt-10 tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                      Download
                    </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>

      <header className=" border-b border-gray-200 bg-indigo-500 text-white darks:bg-gray-800 darks:border-gray-800">
        <div className="container mx-auto xl:max-w-6xl ">
          {/* Navbar */}
          <nav
            className="flex flex-row flex-nowrap items-center justify-between mt-0 py-4 "
            id="desktop-menu"
          >
            {/* logo */}
            <a className="flex items-center py-2 ltr:mr-4 rtl:ml-4 text-xl cursor-default">
              <div className="flex gap-2">
                {" "}
                <span className="w-7">
                  <img src={ulb_data()?.ulb_logo} alt="" srcset=""  className=""/>
                </span>{" "}
                <span className="font-bold text-xl">
                  Ranchi Nagar Nigam, Ranchi
                </span>
              </div>
            </a>

            <div className=" flex justify-center h-max select-none space-x-4">
              <a
                onClick={() => setmanualDialogStatus(true)}
                className="h-[40%] cursor-pointer py-2 flex items-center gap-4 text-gray-100 bg-gray-800 pl-4 pr-6 drop-shadow-lg transition-all duration-200 hover:scale-105 rounded-md"
              >
                <div className="h-[70%] ">
                  {/* <img
                    src={apk}
                    alt=""
                    className="h-8 cursor-pointer"
                    srcset=""
                  /> */}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold py-1">Downloads</span>
                  {/* <span className="text-sm font-semibold">User Manual</span> */}
                </div>
              </a>
              <a
                href="./Fines.apk"
                download
                className="h-[40%] cursor-pointer py-2 flex items-center gap-4 text-gray-100 bg-gray-800 pl-4 pr-6 drop-shadow-lg transition-all duration-200 hover:scale-105 rounded-md"
              >
                <div className="h-[70%] ">
                  <img
                    src={apk}
                    alt=""
                    className="h-8 cursor-pointer"
                    srcset=""
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Download APK</span>
                  {/* <span className="text-sm font-semibold">Android APK</span> */}
                </div>
              </a>
            </div>
          </nav>
        </div>
      </header>
      <main className=" bg-gray-100 flex justify-center items-center md:h-[80vh]">
        <div className="pt-8 bg-gray-100 darks:bg-gray-900 darks:bg-opacity-40">
          <div className="mx-auto px-4 ">
            <div className="flex flex-wrap flex-row justify-center gap-2 items-center">
              <div className=" px-4 w-full md:w-[40%] 2xl:w-[30%]">
                {/* login form */}
                <div className="max-w-full w-full px-2 sm:px-12 lg:pr-20 mb-10 lg:mb-0">
                  <div className="relative">
                    <div className="p-6 sm:py-8 sm:px-12 rounded-lg bg-white darks:bg-gray-800 shadow-xl">
                      <form onSubmit={formik.handleSubmit}>
                        <div className="text-center">
                          <h1 className="text-2xl leading-normal mb-3 font-bold text-gray-800 darks:text-gray-300 text-center">
                            Login
                          </h1>
                        </div>
                        <hr className="block w-12 h-0.5 mx-auto my-5 bg-gray-700 border-gray-700" />
                        <div className="mb-6">
                          <label
                            htmlFor="inputemail"
                            className="inline-block mb-2"
                          >
                            E-mail
                          </label>
                          <input
                            {...formik.getFieldProps("username")}
                            className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 darks:text-gray-300 darks:bg-gray-700 darks:border-gray-700 darks:focus:border-gray-600"
                            defaultValue
                            aria-label="email"
                            type="email"
                            required
                          />
                          <span className="text-red-600 text-xs">
                            {formik.touched.username && formik.errors.username
                              ? formik.errors.username
                              : null}
                          </span>
                        </div>
                        <div className="mb-6">
                          <div className="flex flex-wrap flex-row">
                            <div className="flex-shrink max-w-full w-1/2">
                              <label
                                htmlFor="inputpass"
                                className="inline-block mb-2"
                              >
                                Password
                              </label>
                            </div>
                          </div>
                          <input
                            {...formik.getFieldProps("password")}
                            className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 darks:text-gray-300 darks:bg-gray-700 darks:border-gray-700 darks:focus:border-gray-600"
                            aria-label="password"
                            type="password"
                            defaultValue
                            required
                          />
                          <span className="text-red-600 text-xs">
                            {formik.touched.password && formik.errors.password
                              ? formik.errors.password
                              : null}
                          </span>
                        </div>
                        <div className="grid">
                          {loaderStatus ? (
                            <div className="flex justify-center">
                              <RotatingLines
                                strokeColor="grey"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="25"
                                visible={true}
                              />
                            </div>
                          ) : (
                            <button
                              type="submit"
                              className="py-2 px-4 inline-block text-center rounded leading-normal text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0"
                            >
                              <svg
                                xmlnsXlink="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                className="inline-block w-4 h-4 ltr:mr-2 rtl:ml-2 bi bi-box-arrow-in-right"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
                                />
                                <path
                                  fillRule="evenodd"
                                  d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                                />
                              </svg>
                              Login
                            </button>
                          )}

                          <div
                            onClick={() => modalRef.current.showModal()}
                            className="select-none py-4 text-center font-semibold hover:text-blue-600 hover:underline cursor-pointer"
                          >
                            Forgot Password
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 w-full md:w-[45%]">
                <div className="text-center mt-6 lg:mt-0">
                  <img
                    src={img}
                    alt="welcome"
                    className="w-[60%] h-auto mx-auto hue-rotate-[90deg]"
                  />
                  <div className="px-4 mt-12">
                    <h1 className="text-bold text-4xl mb-2">
                      Fines & Penalties Admin Portal
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className=" bg-white py-6 border-t border-gray-200 darks:bg-gray-800 darks:border-gray-800">
        <div className="container mx-auto px-4 xl:max-w-6xl ">
          <div className="mx-auto px-4">
            <div className="flex flex-wrap flex-row -mx-4">
              <div className="flex-shrink max-w-full px-4 w-full md:w-1/2 text-center md:ltr:text-left md:rtl:text-right"></div>
              <div className="flex-shrink max-w-full px-4 w-full md:w-1/2 text-center md:ltr:text-right md:rtl:text-left"></div>
            </div>
          </div>
        </div>
      </footer>

      {/* 👉 Dialog form 👈 */}
      <dialog
        ref={modalRef}
        className={`relative overflow-clip animate__animated animate__zoomIn animate__faster w-[20rem] backdrop:backdrop-blur-sm p-4 px-6`}
      >
        {/* 👉 Cross button 👈 */}
        <span
          onClick={() => (modalRef.current.close(), formik2.resetForm())}
          className="block p-1 bg-red-100 hover:bg-red-500 rounded-full hover:text-white cursor-pointer transition-all duration-200 absolute top-2 right-2"
        >
          <RxCross2 />
        </span>

        <div>
          <form
            onSubmit={formik2.handleSubmit}
            onChange={(e) => handleChange(e)}
          >
            <div className="text-center">
              <h1 className="text-2xl border-b pb-1 leading-normal mb-4 font-semibold text-gray-800 darks:text-gray-300 text-center">
                Reset Password
              </h1>
            </div>
            <div className=" flex flex-col">
              <label htmlFor={"email"} className={labelStyle}>
                E-mail :{" "}
              </label>
              <input
                {...formik.getFieldProps("email")}
                value={formik2.values.email}
                type={"text"}
                className={
                  inputStyle +
                  ` ${
                    formik2.touched?.email && formik2.errors?.email
                      ? " border-red-200 placeholder:text-red-400 "
                      : " focus:border-zinc-300 border-zinc-200"
                  }`
                }
                name="email"
                id=""
                placeholder="Enter email"
              />
            </div>
            <div className="my-4 text-center font-semibold ">OR</div>
            <div className=" flex flex-col mb-6">
              <label htmlFor={"mobile"} className={labelStyle}>
                Mobile No. :{" "}
              </label>
              <input
                {...formik.getFieldProps("mobile")}
                value={formik2.values.mobile}
                type={"text"}
                className={
                  inputStyle +
                  ` ${
                    formik2.touched?.mobile && formik2.errors?.mobile
                      ? " border-red-200 placeholder:text-red-400 "
                      : " focus:border-zinc-300 border-zinc-200"
                  }`
                }
                name="mobile"
                id=""
                placeholder="Enter mobile no."
              />
            </div>
            <div className="grid mb-2">
              {loaderStatus ? (
                <div className="flex justify-center">
                  <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="25"
                    visible={true}
                  />
                </div>
              ) : (
                <button
                  onClick={formik2.handleSubmit}
                  className="py-2 px-4 inline-block text-center rounded leading-normal text-white bg-slate-500 border border-slate-500 hover:text-white hover:bg-slate-600 hover:ring-0 hover:border-indigo-600 focus:bg-slate-600 focus:border-slate-600 focus:outline-none focus:ring-0"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default Login;
