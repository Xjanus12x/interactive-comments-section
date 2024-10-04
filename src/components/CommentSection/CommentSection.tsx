import { useComment } from "../../context/CommentSectionProvider";
import Comment from "../../models/Comment";
import AddComment from "./AddComment";
import CommentCard from "./CommentCard";
import { AnimatePresence, motion } from "framer-motion";

export default function CommentSection() {
  const {
    commentSection: { comments },
  } = useComment();

  return (
    <section className="grid max-w-screen-md gap-4 mx-auto">
      <ul className="grid gap-4">
        <AnimatePresence>
          {comments.map((comment: Comment, i) => (
            <motion.li
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ duration: 0.5 }}
              key={comment.id}
            >
              <CommentCard comment={comment} commentIndex={i} />
              <ul className="pl-4 overflow-auto border-l-2 border-light-gray sm:pl-12 sm:ml-12 max-h-96">
                <AnimatePresence>
                  {comment?.replies?.map((reply: Comment) => (
                    <motion.li
                    className="mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -200 }}
                      transition={{ duration: 0.5 }}
                      key={reply.id}
                    >
                      <CommentCard comment={reply} commentIndex={i} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <AddComment />
    </section>
  );
}
