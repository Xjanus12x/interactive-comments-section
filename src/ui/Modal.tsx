import ReactDOM from "react-dom";
import { useModal } from "../context/ModalProvider";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useComment } from "../context/CommentSectionProvider";

const Modal = () => {
  const { isOpen, setIsOpen } = useModal();
  const {
    selectedComment,
    setSelectedComment,
    commentsDispatch,
  } = useComment();
  useEffect(() => {
    if (isOpen) {
      // Disable scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      // Re-enable scroll when modal is closed
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 grid p-4 bg-black place-items-center bg-opacity-45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className="w-full max-w-md p-6 space-y-4 bg-white rounded-md shadow-lg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.5,
            }}
            transition={{ delay: 0.1 }}
          >
            <header>
              <h2 className="text-xl font-medium text-dark-blue">
                Delete comment
              </h2>
            </header>
            <p className="text-grayish-blue">
              Are you sure you want to delete this comment? This will remove the
              comment and can't be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-5 py-2.5 uppercase rounded-lg  bg-grayish-blue text-white font-medium"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedComment(null);
                }}
              >
                No, Cancel
              </button>
              <button
                className="px-5 py-2.5 uppercase rounded-lg bg-soft-red text-white font-medium"
                onClick={() => {
                  commentsDispatch({
                    type: "DELETE_COMMENT",
                    payload: selectedComment!,
                  });

                  setIsOpen(false);
                  setSelectedComment(null);
                }}
              >
                Yes, Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("modal-root")!
  );
};

export default Modal;
