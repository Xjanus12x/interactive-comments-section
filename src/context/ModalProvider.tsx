import { createContext, PropsWithChildren, useContext, useState } from "react";

type ModalContext = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const ModalContext = createContext<ModalContext | null>(null);

export function useModal() {
  const context = useContext(ModalContext);

  // Throw an error if the hook is used outside of a ModalContext provider
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  // Return the context
  return {
    isOpen: context.isOpen,
    setIsOpen: context.setIsOpen,
  };
}

type ModalProviderProps = PropsWithChildren;
export default function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ModalContext.Provider>
  );
}
