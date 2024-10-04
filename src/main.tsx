import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import CommentsProvider from "./context/CommentSectionProvider.tsx";
import ModalProvider from "./context/ModalProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CommentsProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </CommentsProvider>
  </StrictMode>
);
