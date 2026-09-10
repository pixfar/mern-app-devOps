import { useEffect, useState } from "react";
import { useCreateNoteMutation } from "@/redux/api/conversationApi";
import { isToken } from "@/services/auth.service";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string | null;
  responseId: string | null;
}

// Custom toolbar configuration with text color and background color options
const toolbarOptions = [
  [{ header: "1" }, { header: "2" }, { font: [] }], // Text style
  [{ list: "ordered" }, { list: "bullet" }], // Lists
  ["bold", "italic", "underline"], // Text formatting
  [{ color: [] }, { background: [] }], // Color and background
  [{ align: [] }], // Text alignment
  ["link"], // Link and image insertion
  ["clean"], // Remove formatting
];

const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  conversationId,
  responseId,
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [text, setText] = useState<string>("");
  // console.log(text);

  const [createNote, { isLoading, error }] = useCreateNoteMutation();

  const token = isToken();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      const res = await createNote({
        data: { text },
        conversationId,
        responseId,
        token,
      }).unwrap();

      // console.log("res", res);

      setText("");

      onClose();
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-lg w-full max-w-xl mx-4 p-6 transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Mitschrift</h2>

        <div className="mb-4 py-10">
          <label className="block text-sm font-medium mb-2">Mitschrift</label>

          <ReactQuill
            theme="snow"
            value={text}
            onChange={setText}
            placeholder="Mitschrift"
            className="h-[30vh]"
            modules={{ toolbar: toolbarOptions }} // Pass custom toolbar options
          />
        </div>

        <div className="flex justify-end space-x-2 mt-10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
