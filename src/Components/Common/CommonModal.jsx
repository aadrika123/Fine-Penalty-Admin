import Modal from "react-modal";


const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "transparent",
        border: "none",
    },
};
Modal.setAppElement("#root");
function CommonModal(props) {
    return (

        <Modal
            isOpen={true}
            style={customStyles}
            contentLabel="Example Modal"
        >
            {/* <div className="overflow-y-scroll"> */}
                {props?.children}
            {/* </div> */}
        </Modal>
    )
}

export default CommonModal