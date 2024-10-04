type UserAvatarProps = {
  className?: string;
  webp: string;
  png: string;
};
export default function UserAvatar({ className, webp, png }: UserAvatarProps) {
  return (
    <picture className={`size-8 ${className}`}>
      <source srcSet={webp} type="image/webp" />
      <img src={`${png}`} alt="User avatar" />
    </picture>
  );
}
