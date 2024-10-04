import { useState } from "react";
import { useComment } from "../../context/CommentSectionProvider";
import CommentInput from "./ui/CommentInput";
import UserAvatar from "./ui/UserAvatar";
import TextButton from "../../ui/TextButton";
import { getTimeDifference } from "../../utils/getTimeDifference";

export default function AddComment() {
  const {
    commentSection: { currentUser },
    commentsDispatch,
    setCurrentHighestIdNumber,
  } = useComment();
  const [newComment, setNewComment] = useState("");

  return (
    <form className="grid items-center gap-4 p-4 bg-white rounded-lg sm:items-start grid-cols-3 sm:grid-cols-[auto_1fr_auto]">
      <div className="grid col-span-full sm:col-span-1">
        <label className="sr-only" id="add-comment-label">
          Add a comment
        </label>
        <CommentInput
          className=""
          aria-labelledby="add-comment-label"
          value={newComment}
          placeholder="Add new comment..."
          onChange={(e) => setNewComment(e.target.value)}
        />
      </div>

      <UserAvatar
        className="sm:col-start-1 sm:row-start-1"
        webp={currentUser.image.webp}
        png={currentUser.image.png}
      />
      <TextButton
        className="col-start-3 sm:col-start-auto "
        type="button"
        buttonLabel="Send"
        onClick={() => {
          if (newComment.trim() !== "") {
            setCurrentHighestIdNumber((prevId) => {
              const newId = prevId + 1;
              commentsDispatch({
                type: "ADD_COMMENT",
                payload: {
                  id: newId, // Use the updated id
                  content: newComment,
                  createdAt: getTimeDifference(new Date()),
                  score: 0,
                  user: {
                    image: {
                      png: currentUser.image.png,
                      webp: currentUser.image.webp,
                    },
                    username: currentUser.username,
                  },
                  replies: [],
                },
              });
              // Clear the textarea after adding the comment
              setNewComment("");
              return newId;
            });
          }
        }}
      />
    </form>
  );
}
