import replyIcon from "../../../public/assets/images/icon-reply.svg";
import deleteIcon from "../../../public/assets/images/icon-delete.svg";
import editIcon from "../../../public/assets/images/icon-edit.svg";

import Comment from "../../models/Comment";

import { useEffect, useRef, useState } from "react";
import { useComment } from "../../context/CommentSectionProvider";
import { useModal } from "../../context/ModalProvider";
import IconButton from "../../ui/IconButton";
import CommentInput from "./ui/CommentInput";
import UserAvatar from "./ui/UserAvatar";
import TextButton from "../../ui/TextButton";
import { useTimeAgo } from "../hooks/useTimeAgo";
import { convertRelativeTimeToDate } from "../../utils/convertRelativeTimeToDate";
import { getTimeDifference } from "../../utils/getTimeDifference";

type CommentCardProps = {
  commentIndex: number;
  comment: Comment;
};
export default function CommentCard({
  commentIndex,
  comment: {
    id,
    content,
    createdAt,
    score,
    replyingTo,
    user: { image, username },
  },
}: CommentCardProps) {
  const {
    commentSection: { currentUser },
    selectedComment,
    setSelectedComment,
    setCurrentHighestIdNumber,
    isEditing,
    setIsEditing,
    isReplying,
    setIsReplying,
    commentsDispatch,
  } = useComment();
  const { setIsOpen } = useModal();
  const convertedDate = convertRelativeTimeToDate(createdAt);
  const timeAgo = useTimeAgo(convertedDate!); // Use the custom hook

  const commentRef = useRef<HTMLTextAreaElement>(null);

  function handleDeleteButton(
    parentCommentIndex: number,
    id: number,
    isReplying: boolean
  ) {
    setIsOpen(true);
    setSelectedComment({ parentCommentIndex, id, isReplying });
  }

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg sm:p-8">
      <CommentScoreButton
        className="hidden max-w-max sm:flex-col sm:flex max-h-max h-max"
        username={username}
        score={score}
        isReplying={replyingTo !== undefined}
        parentCommentIndex={commentIndex}
        id={id}
      />
      <div className=" grid grid-cols-[auto_auto] gap-4 sm:grid-cols-3 justify-self-stretch w-full">
        <header className="flex items-center gap-4 col-span-full sm:col-span-2">
          <UserAvatar webp={image.webp} png={image.png} />
          <h2 className="font-bold text-dark-blue">{username}</h2>
          {currentUser.username === username && (
            <p className="px-2 text-sm text-white rounded-sm bg-moderate-blue">
              you
            </p>
          )}
          <p className="text-grayish-blue">{timeAgo}</p>
        </header>

        {isEditing &&
        currentUser.username === username &&
        id === selectedComment?.id ? (
          <div className="grid col-span-full">
            <CommentInput
              ref={commentRef}
              defaultValue={`${
                !!replyingTo ? `@${replyingTo} ${content}` : content
              }`}
            />
          </div>
        ) : (
          <p className="text-grayish-blue col-span-full">
            {!!replyingTo && (
              <span className="font-bold text-moderate-blue">{`@${replyingTo} `}</span>
            )}
            {content}
          </p>
        )}

        <CommentScoreButton
          className="max-w-max sm:flex-col sm:hidden"
          username={username}
          score={score}
          isReplying={replyingTo !== undefined}
          parentCommentIndex={commentIndex}
          id={id}
        />
        {currentUser.username !== username ? (
          <IconButton
            className="justify-self-end text-moderate-blue sm:col-start-3 sm:row-start-1"
            icon={replyIcon}
            iconAlttext="Reply icon"
            buttonLabel="Reply"
            onClick={() => {
              if (selectedComment === null) {
                setIsReplying(true);
                setIsEditing(true);
                setCurrentHighestIdNumber((prevId) => {
                  const newId = prevId + 1; // Increment the id locally first
                  // Dispatch the action using the newId
                  commentsDispatch({
                    type: "REPLY_COMMENT",
                    payload: {
                      parentCommentIndex: commentIndex,
                      id: newId, // Use the updated id
                      content: "",
                      createdAt: getTimeDifference(new Date()),
                      score: 0,
                      replyingTo: username,
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

                  setSelectedComment({
                    parentCommentIndex: commentIndex,
                    id: newId,
                    isReplying: true,
                  });
                  return newId; // Return the updated id to update the state
                });
              }
            }}
          />
        ) : (
          <div className="flex flex-wrap justify-end gap-4 sm:col-start-3 sm:row-start-1">
            {isEditing && selectedComment?.id === id ? (
              <TextButton
                buttonLabel={`${isReplying ? "Reply" : "Update"}`}
                onClick={() => {
                  const content = commentRef.current?.value;
                  if (content?.length === 0) {
                    handleDeleteButton(
                      commentIndex,
                      id,
                      replyingTo !== undefined
                    );
                  } else if (content !== `@${replyingTo} `) {
                    commentsDispatch({
                      type: "EDIT_COMMENT",
                      payload: {
                        parentCommentIndex: selectedComment!.parentCommentIndex,
                        id: selectedComment!.id,
                        isReplying: selectedComment!.isReplying,
                        newContent: commentRef.current!.value, // Ensure this exists
                      },
                    });
                  }
                  setIsEditing(false);
                  setIsReplying(false);
                  setSelectedComment(null);
                }}
              />
            ) : (
              // <IconButton buttonLabel={"send"} icon={/>
              <>
                <IconButton
                  className="text-soft-red"
                  icon={deleteIcon}
                  iconAlttext="Delete icon"
                  buttonLabel="Delete"
                  onClick={() => {
                    handleDeleteButton(
                      commentIndex,
                      id,
                      replyingTo !== undefined
                    );
                  }}
                />
                <IconButton
                  className="text-moderate-blue"
                  icon={editIcon}
                  iconAlttext="Edit icon"
                  buttonLabel="Edit"
                  onClick={() => {
                    setIsEditing(true);
                    setSelectedComment({
                      parentCommentIndex: commentIndex,
                      id,
                      isReplying: replyingTo !== undefined,
                    });
                  }}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

type CommentScoreButtonProps = {
  className?: string;
  username: string;
  isReplying: boolean;
  parentCommentIndex: number;
  id?: number;
  score: number;
};
function CommentScoreButton({
  className,
  username,
  isReplying,
  parentCommentIndex,
  id,
  score,
}: CommentScoreButtonProps) {
  const {
    commentsDispatch,
    commentSection: { currentUser },
  } = useComment();
  const [commentScore, setCommentScore] = useState(score);
  const [hasIncrease, setHasIncrease] = useState(false);

  useEffect(() => {
    if (hasIncrease) {
      commentsDispatch({
        type: "INCREASE_COMMENT_SCORE",
        payload: {
          isReplying: isReplying !== undefined,
          parentCommentIndex,
          id,
          score: commentScore,
        },
      });
    }
  }, [hasIncrease]);

  return (
    <div
      className={`flex items-center gap-5 px-4 py-3 rounded-lg bg-very-light-gray ${className}`}
    >
      <IconButton
        icon={
          <svg
            width="11"
            height="11"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current" // Use currentColor for the fill
          >
            <path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" />
          </svg>
        }
        iconAlttext="Increase score icon"
        buttonLabel="Increase comment score."
        hideButtonLabel={true}
        onClick={() => {
          if (!hasIncrease) {
            setCommentScore((prevScore) => prevScore + 1);
            setHasIncrease(true);
          }
        }}
        disabled={currentUser.username === username}
      />

      <span
        className="font-medium text-moderate-blue outline-offset-4 focus-visible:outline-dotted outline-2"
        aria-label="Comment score"
        tabIndex={0}
      >
        {commentScore}
      </span>

      <IconButton
        icon={
          <svg
            width="11"
            height="3"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current"
          >
            <path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" />
          </svg>
        }
        iconAlttext="Decrease score icon"
        buttonLabel="Decrease comment score."
        hideButtonLabel={true}
        onClick={() => {
          if (hasIncrease) {
            setCommentScore((prevScore) => prevScore - 1);
            setHasIncrease(false);
          }
        }}
        disabled={currentUser.username === username}
      />
    </div>
  );
}
