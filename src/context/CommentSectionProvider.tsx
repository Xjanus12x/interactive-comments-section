import {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
  useState,
} from "react";
import data from "../../public/assets/data.json";
import User from "../models/User";
import Comment from "../models/Comment";

type SelectedComment = {
  parentCommentIndex: number;
  id: number;
  isReplying: boolean;
};
type CommentsContextType = {
  commentsState: CommentsState;
  commentsDispatch: React.Dispatch<Action>;
  selectedComment: SelectedComment | null;
  setSelectedComment: React.Dispatch<
    React.SetStateAction<SelectedComment | null>
  >;
  currentHighestIdNumber: number;
  setCurrentHighestIdNumber: React.Dispatch<React.SetStateAction<number>>;
  isEditting: boolean;
  setIsEditting: React.Dispatch<React.SetStateAction<boolean>>;
  isReplying: boolean;
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentsContext = createContext<CommentsContextType | null>(null);

type CommentsProviderProps = PropsWithChildren;

type CommentsState = {
  currentUser: User;
  comments: Comment[];
};

type AddComment = {
  type: "ADD_COMMENT";
  payload: Comment;
};

type DeleteComment = {
  type: "DELETE_COMMENT";
  payload: { parentCommentIndex?: number; id?: number; isReplying: boolean };
};
type EditComment = {
  type: "EDIT_COMMENT";
  payload: {
    parentCommentIndex: number;
    id: number;
    isReplying: boolean;
    newContent: string;
  };
};

type ReplyComment = {
  type: "REPLY_COMMENT";
  payload: {
    parentCommentIndex: number;
  } & Comment;
};

type CommonPayload = {
  isReplying: boolean;
  parentCommentIndex: number;
  id?: number;
};

type IncreaseCommentScore = {
  type: "INCREASE_COMMENT_SCORE";
  payload: {
    score: number;
  } & CommonPayload;
};

type UpdateCreatedAt = {
  type: "UPDATE_CREATED_AT";
  payload: {
    createdAt: string;
  } & CommonPayload;
};
type Action =
  | AddComment
  | DeleteComment
  | EditComment
  | ReplyComment
  | IncreaseCommentScore
  | UpdateCreatedAt;

const ACTIONS = {
  ADD_COMMENT: "ADD_COMMENT",
  DELETE_COMMENT: "DELETE_COMMENT",
  EDIT_COMMENT: "EDIT_COMMENT",
  REPLY_COMMENT: "REPLY_COMMENT",
  INCREASE_COMMENT_SCORE: "INCREASE_COMMENT_SCORE",
  UPDATE_CREATED_AT: "UPDATE_CREATED_AT",
};

const initialState: CommentsState = data;

function commentsReducer(state: CommentsState, action: Action): CommentsState {
  switch (action.type) {
    case ACTIONS.ADD_COMMENT: {
      const payload = (action as AddComment).payload;
      return { ...state, comments: [...state.comments, payload] };
    }

    case ACTIONS.DELETE_COMMENT: {
      const {
        payload: { parentCommentIndex, id, isReplying },
      } = action as DeleteComment;
      if (isReplying && parentCommentIndex !== undefined) {
        // Create a new array for replies by filtering out the deleted reply
        const updatedReplies =
          state.comments[parentCommentIndex]?.replies?.filter(
            (reply) => reply.id !== id
          ) ?? [];

        // Create a new comments array with the updated replies for the specific comment
        const updatedComments = updateComments(
          state.comments,
          parentCommentIndex,
          updatedReplies
        );

        // Return the new state with the updated comments array
        return { ...state, comments: updatedComments };
      } else {
        const updatedComments = state.comments.filter(
          (comment) => comment.id !== id
        );
        return { ...state, comments: updatedComments };
      }
    }
    case ACTIONS.EDIT_COMMENT: {
      const {
        payload: { parentCommentIndex, id, isReplying, newContent },
      } = action as EditComment;

      if (isReplying) {
        // Create a new array for replies by filtering out the deleted reply
        const updatedReplies: Comment[] =
          state.comments[parentCommentIndex]?.replies?.map((reply) => {
            if (reply.id === id) {
              const content = newContent.split(" ").slice(1).join(" ");
              return { ...reply, content };
            }
            return reply;
          }) ?? [];

        // Create a new comments array with the updated replies for the specific comment
        const updatedComments = updateComments(
          state.comments,
          parentCommentIndex,
          updatedReplies
        );
        // Return the new state with the updated comments array
        return { ...state, comments: updatedComments };
      } else {
        // Create a new array for replies by filtering out the deleted reply
        const updatedComments = state.comments.map((comment, index) => {
          if (index === parentCommentIndex) {
            return { ...comment, content: newContent };
          } else return comment;
        });

        return { ...state, comments: updatedComments };
      }
    }
    case ACTIONS.REPLY_COMMENT: {
      const {
        payload: { parentCommentIndex, ...newReply },
      } = action as ReplyComment;

      // Get existing replies for the parent comment
      const oldReplies = state.comments[parentCommentIndex].replies || [];
      // Append the new reply
      const updatedReplies = [newReply, ...oldReplies];

      // Update the parent comment with the new replies array
      const updatedComments = updateComments(
        state.comments,
        parentCommentIndex,
        updatedReplies
      );
      return { ...state, comments: updatedComments };
    }
    case ACTIONS.INCREASE_COMMENT_SCORE: {
      const {
        payload: { isReplying, parentCommentIndex, id, score },
      } = action as IncreaseCommentScore;

      if (isReplying) {
        const updatedScore =
          state.comments[parentCommentIndex].replies?.map((reply) => {
            return reply.id === id ? { ...reply, score } : reply;
          }) ?? [];

        const updatedComments = updateComments(
          state.comments,
          parentCommentIndex,
          updatedScore
        );

        return { ...state, comments: updatedComments };
      }
      return state;
    }
    case ACTIONS.UPDATE_CREATED_AT: {
      const {
        payload: { isReplying, parentCommentIndex, id, createdAt },
      } = action as UpdateCreatedAt;
      if (isReplying) {
        const updatedReplies =
          state.comments[parentCommentIndex].replies?.map((reply) =>
            reply.id === id ? { ...reply, createdAt } : reply
          ) ?? [];

        const updatedComments = updateComments(
          state.comments,
          parentCommentIndex,
          updatedReplies
        );
        return { ...state, comments: updatedComments };
      } else {
        const updatedComments = state.comments.map((comment, index) =>
          parentCommentIndex === index ? { ...comment, createdAt } : comment
        );
        return { ...state, comments: updatedComments };
      }
    }
    default:
      return state;
  }
}

export function useComment() {
  const context = useContext(CommentsContext);

  if (!context) {
    throw new Error("useComment must be used within a CommentsProvider");
  }

  return {
    commentSection: context.commentsState,
    commentsDispatch: context.commentsDispatch,
    selectedComment: context.selectedComment,
    setSelectedComment: context.setSelectedComment,
    currentHighestIdNumber: context.currentHighestIdNumber,
    setCurrentHighestIdNumber: context.setCurrentHighestIdNumber,
    isEditing: context.isEditting,
    setIsEditing: context.setIsEditting,
    isReplying: context.isReplying,
    setIsReplying: context.setIsReplying,
  };
}

export default function CommentsProvider({ children }: CommentsProviderProps) {
  const [commentsState, commentsDispatch] = useReducer(
    commentsReducer,
    initialState
  );
  const [currentHighestIdNumber, setCurrentHighestIdNumber] = useState(4);
  const [selectedComment, setSelectedComment] =
    useState<SelectedComment | null>(null);
  const [isEditting, setIsEditting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  return (
    <CommentsContext.Provider
      value={{
        commentsState,
        commentsDispatch,
        selectedComment,
        setSelectedComment,
        currentHighestIdNumber,
        setCurrentHighestIdNumber,
        isEditting,
        setIsEditting,
        isReplying,
        setIsReplying,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
}

function updateComments(
  comments: Comment[],
  parentCommentIndex: number,
  updatedComments: Comment[]
) {
  return comments.map((comment, index) => {
    return index === parentCommentIndex
      ? { ...comment, replies: updatedComments }
      : comment;
  });
}
