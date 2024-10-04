import { forwardRef } from "react";

type CommentInputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

const CommentInput = forwardRef<HTMLTextAreaElement, CommentInputProps>(
  ({ className, ...rest }, ref) => {
    return (
      <textarea
        className={`px-5 py-4 border-2 rounded-md resize-none border-light-gray placeholder:text-grayish-blue min-h-24 focus:outline-moderate-blue sm:min-h-28 ${className}`}
        ref={ref}
        aria-labelledby="add-comment-label"
        {...rest} // Spread other textarea attributes
      />
    );
  }
);

export default CommentInput;
