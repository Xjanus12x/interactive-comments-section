import CommentSection from "./components/CommentSection/CommentSection";
import Modal from "./ui/Modal";

function App() {
  return (
    <>
      <main className="px-4 py-6 bg-very-light-gray min-h-dvh">
        <CommentSection />
        <Modal />
      </main>
    </>
  );
}

export default App;
